# 🌄 MountInsight — Capstone Project

MountInsight adalah aplikasi berbasis web yang menyediakan informasi dan rekomendasi pendakian gunung di Jawa Timur menggunakan Machine Learning. 

Proyek ini terdiri dari 3 komponen utama:

- 🔵 **Frontend** — Javascript
- 🟢 **Backend** — Node.js + Hapi.js
- 🧠 **Model ML** — FastAPI + Python

---

## 📁 Struktur Folder

📦MountInsight/
├── FrontEnd-MountInsight/ # Frontend (Javascript)
├── BackEnd-MountInsight/ # Backend (Node.js + Hapi)
└── Recommendation-System/ # Machine Learning API (FastAPI)

---

## 🔗 Link Deployment

| Modul    | Status     | URL                                                                                |
| -------- | ---------- | ---------------------------------------------------------------------------------- |
| Frontend | ✅ Deployed | [https://silver-liger-72881c.netlify.app](https://silver-liger-72881c.netlify.app) |
| Backend  | ✅ Deployed | `(https://backend-mountinsight-d77f70814482.herokuapp.com/)`                                 |
| Model ML | ❌ Lokal    | Lihat petunjuk di bawah untuk menjalankan                                          |

---

## 🚀 Menjalankan Model ML secara Lokal

Karena saat ini model Machine Learning belum dideploy secara online, Anda dapat menjalankannya secara lokal dengan mengikuti langkah-langkah berikut:

### 1️⃣ Buat Virtual Environment (Python < 3.12.x). Pastikan Python sudah terpasang, dan versinya **di bawah 3.12**.
```python -m venv venv```

### 2️⃣ Aktifkan Virtual Environment
```.\venv\Scripts\activate```

### 3️⃣ Install Dependencies
```pip install -r requirements.txt```

### 4️⃣ Jalankan FastAPI Server
```uvicorn app:app --reload --host 0.0.0.0 --port 8000```

### 5️⃣ Jalankan Frontend
Pastikan frontend sudah berjalan karena aplikasi akan mengakses model ML 

⚙️ Konfigurasi Frontend
Pastikan file config.js Anda seperti berikut:
```
const CONFIG = {
  BASE_URL: "https://backend-mountinsight-d77f70814482.herokuapp.com",
  ML_BASE_URL: "http://127.0.0.1:8000",
};
export default CONFIG;
```
---

❗ Jika Backend tidak berjalan:
Ganti BASE_URL di FrontEnd-MountInsight/src/scriptsconfig.js menjadi:
```BASE_URL: "http://localhost:7000"```

## 🧰 Menjalankan Backend Secara Lokal
### 1️⃣ Masuk ke folder backend:
```cd backend-mountinsight```

### 2️⃣ Lalu install dependencies:
```npm install```

### 3️⃣ Jalankan server:
```node server.js```
