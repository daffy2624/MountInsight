const getConnection = require("../db");

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

    const { name, age, gender, gambar_profil } = request.payload;

    const connection = await getConnection();

    const [result] = await connection.execute(
      "UPDATE profil SET nama = ?, age = ?, gender = ?, gambar_profil = ? WHERE id = ?",
      [name, age, gender, gambar_profil, id]
    );
    
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