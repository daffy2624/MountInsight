# app.py

# --- Import Library ---
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.layers import TextVectorization, Embedding, GlobalAveragePooling1D, Input
from tensorflow.keras.models import Model
from tensorflow.keras.utils import register_keras_serializable
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

# --- Konfigurasi Logging ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Inisialisasi Aplikasi FastAPI ---
app = FastAPI(
    title="Sistem Rekomendasi Gunung CBF Murni",
    description="API untuk merekomendasikan gunung di Jawa Timur berdasarkan preferensi konten pengguna."
)

# --- Konfigurasi CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Mengizinkan semua origin (untuk pengembangan lokal)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Variabel Global untuk Model dan Komponen CBF ---
loaded_text_embedding_model_cbf = None
loaded_scaler_cbf = None
loaded_df_cbf_unique_mountains = None
loaded_final_features_matrix_cbf = None
loaded_present_numeric_cols_cbf = []


# --- Fungsi custom_standardization (Penting untuk Loading CBF Model) ---
@register_keras_serializable()
def custom_standardization(input_data):
    lowercase = tf.strings.lower(input_data)
    # Menggunakan raw string untuk regex agar tidak ada SyntaxWarning
    stripped_html = tf.strings.regex_replace(lowercase, r'<br\s*/>', ' ')
    cleaned_text = tf.strings.regex_replace(stripped_html, r'[^a-z0-9\s]', '')
    return cleaned_text

# --- Fungsi untuk Memuat Model dan Komponen CBF (akan dipanggil saat aplikasi startup) ---
@app.on_event("startup")
async def load_cbf_models_and_components_startup():
    global loaded_text_embedding_model_cbf, loaded_scaler_cbf, loaded_df_cbf_unique_mountains, loaded_final_features_matrix_cbf
    global loaded_present_numeric_cols_cbf

    MODEL_DIR = 'cbf_model_exports' # Lokasi folder model CBF

    logging.info("Memuat model dan komponen Content-Based Filtering...")
    try:
        CBF_EMBEDDING_MODEL_PATH = os.path.join(MODEL_DIR, 'text_embedding_model_cbf.keras')
        SCALER_CBF_PATH = os.path.join(MODEL_DIR, 'scaler_cbf.joblib')
        CBF_COMPONENTS_PATH = os.path.join(MODEL_DIR, 'cbf_components.joblib')

        loaded_text_embedding_model_cbf = keras.models.load_model(
            CBF_EMBEDDING_MODEL_PATH,
            custom_objects={'custom_standardization': custom_standardization}
        )
        loaded_scaler_cbf = joblib.load(SCALER_CBF_PATH)
        
        cbf_components_loaded = joblib.load(CBF_COMPONENTS_PATH)
        loaded_df_cbf_unique_mountains = cbf_components_loaded['df_cbf_unique_mountains']
        loaded_final_features_matrix_cbf = cbf_components_loaded['final_features_matrix_cbf']
        loaded_present_numeric_cols_cbf = cbf_components_loaded['present_numeric_cols_cbf'] # Memuat daftar kolom numerik
        logging.info("Komponen Content-Based Filtering berhasil dimuat.")

    except Exception as e:
        logging.error(f"Gagal memuat model atau komponen CBF: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Gagal memuat model/komponen: {e}")

# --- Fungsi Rekomendasi Content-Based Filtering (disalin dari notebook, disesuaikan untuk global vars) ---
def recommend_mountains_cbf(
    cbf_preferences: dict, # Dict: {'Lokasi', 'Budget', 'Tingkat_Kesulitan', 'Cocok_Pemula', 'Fasilitas_Basecamp'}
    num_recommendations: int = 5
):
    # Inisialisasi metrik output di awal fungsi
    cbf_metrics = {}

    # Mengakses variabel global yang sudah dimuat
    global loaded_text_embedding_model_cbf, loaded_scaler_cbf, loaded_df_cbf_unique_mountains, loaded_final_features_matrix_cbf
    global loaded_present_numeric_cols_cbf

    # Validasi komponen sudah dimuat
    if (loaded_text_embedding_model_cbf is None or loaded_scaler_cbf is None or
        loaded_df_cbf_unique_mountains is None or loaded_final_features_matrix_cbf is None):
        cbf_metrics['status'] = "Komponen model tidak lengkap."
        logging.error("Komponen model CBF tidak lengkap saat recommend_mountains_cbf dipanggil.")
        return pd.DataFrame(), cbf_metrics

    # --- 1. Lakukan Filter Awal (Hard Filters) dari CBF Preferences ---
    # Catatan: filtered_df_cbf akan dibuat dari df_cbf (dataset asli)
    candidate_df = loaded_df_cbf_unique_mountains.copy() # Menggunakan df_cbf global

    # Filter Cocok Untuk Pemula - default 'Ya' jika tidak ada input atau user memilih 'Ya'
    # Defaulting ini dilakukan di API endpoint sebelum pemanggilan fungsi ini
    # Jadi di sini kita asumsikan cbf_preferences['cocok_pemula'] sudah ada.
    if cbf_preferences.get('cocok_pemula', 'ya').lower() == 'tidak': # Gunakan default 'ya' di sini juga untuk safety
        candidate_df = candidate_df[candidate_df['Cocok_Untuk_Pemula'].str.lower() == 'tidak']
    else: # Jika 'Ya' atau default
        candidate_df = candidate_df[candidate_df['Cocok_Untuk_Pemula'].str.lower() == 'ya']


    # --- Strategi Filter Bertahap ---
    # Didefinisikan di sini agar bisa diakses oleh filter_stages
    difficulty_order = ['mudah', 'sedang', 'sulit'] # Definisikan di sini agar bisa diakses dalam lambda

    filter_stages = [
        # Tahap 1: Semua Filter yang tersisa (Lokasi, Budget, Tingkat Kesulitan)
        lambda df, prefs: df[
            (df['Lokasi_Kabupaten_Utama'].apply(lambda x: prefs.get('lokasi', '').lower() in str(x).lower()) if prefs.get('lokasi') else True) &
            (df['Budget_Per_Orang_Rupiah_RataRata'] <= prefs.get('budget', np.inf) if prefs.get('budget') is not None else True) &
            (df['Tingkat_Kesulitan_Pendakian'].str.lower().isin(difficulty_order[:difficulty_order.index(prefs.get('tingkat_kesulitan', 'sulit').lower()) + 1]) if prefs.get('tingkat_kesulitan') else True)
        ],
        # Tahap 2: Hilangkan filter Lokasi (jika sebelumnya disetel)
        lambda df, prefs: df[
            (df['Budget_Per_Orang_Rupiah_RataRata'] <= prefs.get('budget', np.inf) if prefs.get('budget') is not None else True) &
            (df['Tingkat_Kesulitan_Pendakian'].str.lower().isin(difficulty_order[:difficulty_order.index(prefs.get('tingkat_kesulitan', 'sulit').lower()) + 1]) if prefs.get('tingkat_kesulitan') else True)
        ],
        # Tahap 3: Hanya filter Tingkat Kesulitan (jika sebelumnya disetel)
        lambda df, prefs: df[
            (df['Tingkat_Kesulitan_Pendakian'].str.lower().isin(difficulty_order[:difficulty_order.index(prefs.get('tingkat_kesulitan', 'sulit').lower()) + 1]) if prefs.get('tingkat_kesulitan') else True)
        ],
        # Tahap Terakhir: Rekomendasi populer (dari seluruh dataset)
        lambda df, prefs: loaded_df_cbf_unique_mountains.sort_values(by='Rating_Rata_Rata', ascending=False)
    ]

    final_filtered_df_for_similarity = pd.DataFrame()
    last_filter_stage_applied_msg = ""

    current_pool_for_stages = candidate_df.copy() # Mulai dari pool yang sudah difilter Cocok_Untuk_Pemula

    for i, filter_func in enumerate(filter_stages):
        temp_filtered_df = filter_func(current_pool_for_stages, cbf_preferences)
        if not temp_filtered_df.empty:
            final_filtered_df_for_similarity = temp_filtered_df
            last_filter_stage_applied_msg = f"Tahap {i+1} filter."
            break
        # Jika filter_func menghasilkan empty dataframe, coba filter berikutnya pada original initial_candidate_pool
        # (ini adalah pool setelah Cocok_Untuk_Pemula).
        if i < len(filter_stages) - 1:
            current_pool_for_stages = candidate_df.copy() # Reset candidate untuk tahap filter berikutnya
        else: # Tahap terakhir adalah fallback global
            current_pool_for_stages = loaded_df_cbf_unique_mountains.copy() # Pastikan fallback dari semua gunung

    if final_filtered_df_for_similarity.empty: # Jika setelah semua tahap filter masih kosong (harusnya tidak terjadi dengan fallback)
        final_filtered_df_for_similarity = loaded_df_cbf_unique_mountains.sort_values(by='Rating_Rata_Rata', ascending=False)
        last_filter_stage_applied_msg = "Tahap Fallback: Rekomendasi populer dari seluruh dataset."
        
    print(f"Filter hard diterapkan: {last_filter_stage_applied_msg}")


    # --- 2. Buat Profil Konten Pengguna ---
    cbf_user_text_raw = f"{cbf_preferences.get('lokasi', '')} " \
                        f"{cbf_preferences.get('tingkat_kesulitan', '')} " \
                        f"{cbf_preferences.get('cocok_pemula', '')} " \
                        f"{cbf_preferences.get('fasilitas_basecamp', '')}"


    processed_user_text = custom_standardization(tf.constant([cbf_user_text_raw], dtype=tf.string))
    cbf_user_text_embedding = loaded_text_embedding_model_cbf.predict(processed_user_text, verbose=0).flatten()

    # Siapkan fitur numerik pengguna untuk scaling (Budget)
    cbf_user_num_feature_values = []
    if loaded_present_numeric_cols_cbf: # Pastikan ada kolom numerik yang diskalakan
        # Ambil nilai default/rata-rata dari df_cbf (dataset asli)
        default_ketinggian = loaded_df_cbf_unique_mountains['Ketinggian_MDPL'].mean() if 'Ketinggian_MDPL' in loaded_df_cbf_unique_mountains.columns else 0.0
        default_durasi = loaded_df_cbf_unique_mountains['Durasi_Pendakian_Hari_RataRata'].mean() if 'Durasi_Pendakian_Hari_RataRata' in loaded_df_cbf_unique_mountains.columns else 0.0
        default_budget_df = loaded_df_cbf_unique_mountains['Budget_Per_Orang_Rupiah_RataRata'].mean() if 'Budget_Per_Orang_Rupiah_RataRata' in loaded_df_cbf_unique_mountains.columns else 0.0
        # default_pos dihapus karena kolom Jumlah_Pos_Pendakian_RataRata sudah tidak ada
        default_rating = loaded_df_cbf_unique_mountains['Rating_Rata_Rata'].mean() if 'Rating_Rata_Rata' in loaded_df_cbf_unique_mountains.columns else 0.0

        for col_name in loaded_present_numeric_cols_cbf:
            if col_name == 'Budget_Per_Orang_Rupiah_RataRata':
                cbf_user_num_feature_values.append(cbf_preferences.get('budget', default_budget_df))
            elif col_name == 'Ketinggian_MDPL':
                cbf_user_num_feature_values.append(default_ketinggian)
            elif col_name == 'Durasi_Pendakian_Hari_RataRata':
                cbf_user_num_feature_values.append(default_durasi)
            elif col_name == 'Rating_Rata_Rata':
                cbf_user_num_feature_values.append(default_rating)
    
    cbf_user_num_features_placeholder = np.array(cbf_user_num_feature_values).reshape(1, -1)
    
    if loaded_present_numeric_cols_cbf:
        # Cek jika ada NaN di placeholder sebelum transform
        if np.isnan(cbf_user_num_features_placeholder).any():
            print(f"Peringatan: NaN terdeteksi di cbf_user_num_features_placeholder: {cbf_user_num_features_placeholder}. Mengisi dengan 0.")
            cbf_user_num_features_placeholder[np.isnan(cbf_user_num_features_placeholder)] = 0 # Imputasi NaN dengan 0
        
        cbf_user_scaled_numeric_features = loaded_scaler_cbf.transform(cbf_user_num_features_placeholder).flatten()
    else:
        cbf_user_scaled_numeric_features = np.array([])

    if cbf_user_scaled_numeric_features.size > 0:
        cbf_user_profile_vector = np.hstack((cbf_user_text_embedding, cbf_user_scaled_numeric_features)).reshape(1, -1)
    else:
        cbf_user_profile_vector = cbf_user_text_embedding.reshape(1, -1)


    # --- 3. Dapatkan Fitur Gunung yang Sudah Difilter dan Hitung Kemiripan ---
    # Gunakan final_filtered_df_for_similarity sebagai dasar untuk perhitungan kemiripan
    cbf_filtered_indices = final_filtered_df_for_similarity.index
    cbf_mountains_features = loaded_final_features_matrix_cbf[cbf_filtered_indices]

    # Hitung Cosine Similarity
    cb_similarity_scores = cosine_similarity(cbf_user_profile_vector, cbf_mountains_features).flatten()
    cb_similarity_scores_normalized = (cb_similarity_scores + 1) / 2 # Scale -1 to 1 to 0-1

    final_filtered_df_for_similarity['Similarity_Score'] = cb_similarity_scores_normalized
    
    # --- 4. Urutkan dan Ambil Top-N Rekomendasi ---
    recommendations_df = final_filtered_df_for_similarity.sort_values(by='Similarity_Score', ascending=False).head(num_recommendations)

    # --- Metrik Evaluasi untuk Hasil Prediksi ---
    cbf_metrics['Jumlah_Rekomendasi'] = len(recommendations_df)
    if not recommendations_df.empty:
        cbf_metrics['Rata_rata_Similarity_Score'] = recommendations_df['Similarity_Score'].mean()
        cbf_metrics['Min_Similarity_Score'] = recommendations_df['Similarity_Score'].min()
        cbf_metrics['Max_Similarity_Score'] = recommendations_df['Similarity_Score'].max()
        cbf_metrics['Gunung_Unik_Direkomendasikan'] = recommendations_df['Nama_Gunung'].nunique()
    else:
        cbf_metrics['status'] = "Tidak ada rekomendasi yang ditemukan."
    
    # Kolom yang akan ditampilkan
    display_cols = [
        'Nama_Gunung', 'Lokasi_Kabupaten_Utama', 'Ketinggian_MDPL',
        'Tingkat_Kesulitan_Pendakian', 'Cocok_Untuk_Pemula',
        'Durasi_Pendakian_Hari_RataRata', 'Budget_Per_Orang_Rupiah_RataRata',
        'Rating_Rata_Rata', 'Similarity_Score'
    ]
    
    final_display_cols = [col for col in display_cols if col in recommendations_df.columns]
    
    return recommendations_df[final_display_cols], cbf_metrics

# --- Pydantic Model untuk Validasi Input API ---
class RecommendationRequest(BaseModel):
    lokasi: str = Field(..., example="Malang", description="Lokasi kabupaten utama gunung.")
    budget: int = Field(..., gt=0, description="Budget maksimal per orang dalam Rupiah.")
    tingkat_kesulitan: str = Field(..., pattern=r"^(mudah|sedang|sulit)$", description="Tingkat kesulitan pendakian (mudah, sedang, sulit).")
    cocok_pemula: Optional[str] = Field(None, pattern=r"^(Ya|Tidak)$", description="Apakah cocok untuk pemula (Ya/Tidak). Akan default 'Ya' jika tidak diisi.") 
    fasilitas_basecamp: str = Field("", description="Fasilitas di basecamp (opsional, misal: warung, toilet).")
    num_recommendations: int = Field(5, gt=0, le=10, description="Jumlah rekomendasi yang diinginkan (1-10).")

# --- Endpoint API Rekomendasi CBF ---
@app.post("/recommend_cbf")
async def recommend_cbf_api(request_data: RecommendationRequest):
    try:
        cbf_preferences = request_data.dict()
        num_recommendations = cbf_preferences.pop('num_recommendations')

        # Handle default value for 'cocok_pemula' jika tidak diinput oleh user
        if cbf_preferences.get('cocok_pemula') is None or cbf_preferences.get('cocok_pemula') == "":
            cbf_preferences['cocok_pemula'] = 'Ya' 

        recommendations_df, metrics_output = recommend_mountains_cbf(
            cbf_preferences=cbf_preferences,
            num_recommendations=num_recommendations,
            # Parameter model sekarang diakses secara global, tidak perlu dilewatkan lagi di sini
        )

        if not recommendations_df.empty:
            return {
                "recommendations": recommendations_df.to_dict(orient='records'),
                "metrics": metrics_output
            }
        else:
            return {
                "message": metrics_output.get('status', 'Tidak ada rekomendasi yang cocok dengan kriteria Anda.'),
                "recommendations": [],
                "metrics": metrics_output
            }

    except Exception as e:
        logging.error(f"Terjadi kesalahan saat memproses permintaan API: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan internal server: {e}")

# --- Fungsi untuk menjalankan server (hanya jika skrip dijalankan langsung) ---
if __name__ == '__main__':
    load_cbf_models_and_components_startup()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)