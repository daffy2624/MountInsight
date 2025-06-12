const getConnection = require("../db");

const getMountainById = async (request, header) => {
  try {
    const { id } = request.params;

    const connection = await getConnection();

    const [result] = await connection.execute(
      "SELECT nama, deskripsi, gambar from list_gunung WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return header
        .response({
          status: "fail",
          message: `Gunung dengan ID ${id} tidak ditemukan`,
        })
        .code(404);
    }

    const mountain = result[0];

    return header
      .response({
        status: "success",
        data: {
          mountain,
        },
      })
      .code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    return header
      .response({
        status: "error",
        message: "Gagal mengambil Gunung",
      })
      .code(500);
  }
};

const getMountainByName = async (request, header) => {
  try {
    const { name } = request.params;

    const connection = await getConnection();

    const [result] = await connection.execute(
      "SELECT id, nama, deskripsi, gambar from list_gunung WHERE nama = ?",
      [name]
    );

    if (result.length === 0) {
      return header
        .response({
          status: "fail",
          message: `Gunung dengan Name ${name} tidak ditemukan`,
        })
        .code(404);
    }

    const mountain = result[0];

    return header
      .response({
        status: "success",
        data: {
          mountain,
        },
      })
      .code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    return header
      .response({
        status: "error",
        message: "Gagal mengambil Gunung",
      })
      .code(500);
  }
};

const getAllMountain = async (request, header) => {
  try {
    const connection = await getConnection();

    const [result] = await connection.execute(
      "SELECT id, nama, deskripsi, gambar FROM list_gunung"
    );

    if (result.length === 0) {
      return header
        .response({
          status: "fail",
          message: "Tidak ada data gunung yang ditemukan",
        })
        .code(404);
    }

    return header
      .response({
        status: "success",
        data: {
          mountains: result,
        },
      })
      .code(200);
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    return header
      .response({
        status: "error",
        message: "Gagal mengambil daftar gunung",
      })
      .code(500);
  }
};

module.exports = { getMountainById, getAllMountain, getMountainByName };
