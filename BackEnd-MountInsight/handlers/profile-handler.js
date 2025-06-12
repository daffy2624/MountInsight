const getConnection = require("../db");
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const pump = promisify(pipeline);

const getProfileById = async (request, header) => {
  try {
    const { id } = request.params;

    const connection = await getConnection();

    const [result] = await connection.execute(
      "SELECT nama, email, age, gender, gambar_profil from profil WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return header
        .response({
          status: "fail",
          message: `Profil dengan ID ${id} tidak ditemukan`,
        })
        .code(404);
    }

    const profile = result[0];

    return header
      .response({
        status: "success",
        data: {
          profile,
        },
      })
      .code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    return header
      .response({
        status: "error",
        message: "Gagal mengambil profil",
      })
      .code(500);
  }
};

const updateProfile = async (request, header) => {
  try {
    const { id } = request.params;
    const { name, age, gender } = request.payload;
    let fileName = null;
    let file = request.payload.gambar_profil;

    // Jika user mengunggah file gambar_profil
    if (file && file.hapi && file._readableState) {
      const uploadDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      fileName = `${Date.now()}-${file.hapi.filename}`;
      const filePath = path.join(uploadDir, fileName);

      await pump(file, fs.createWriteStream(filePath));
    }

    const connection = await getConnection();

    let query = '';
    let params = [];

    if (fileName) {
      // Jika user mengirim gambar_profil
      query = `UPDATE profil SET nama = ?, age = ?, gender = ?, gambar_profil = ? WHERE id = ?`;
      params = [name, age, gender, fileName, id];
    } else {
      // Jika user tidak kirim gambar_profil, jangan update kolomnya
      query = `UPDATE profil SET nama = ?, age = ?, gender = ? WHERE id = ?`;
      params = [name, age, gender, id];
    }

    console.log({
      name,
      age,
      gender,
      id,
      gambar_profil: request.payload.gambar_profil ? 'ADA' : 'TIDAK ADA',
    });
    console.log('Query:', query);
    console.log('Params:', params);

    const [result] = await connection.execute(query, params);
    
    if (result.affectedRows === 0) {
      return header
        .response({
          status: "fail",
          message: `Profil dengan ID ${id} tidak ditemukan`,
        })
        .code(404);
    }

    return header
      .response({
        status: "success",
        message: "Profil berhasil diperbarui.",
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return header
      .response({
        status: "error",
        message: "Gagal memperbarui profil.",
      })
      .code(500);
  }
};

module.exports = { getProfileById, updateProfile};