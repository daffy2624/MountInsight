const getConnection = require("../db");

const register = async (request, header) => {
  try {
    const { name, email, password, age, gender } = request.payload;

    const connection = await getConnection();

    const [result] = await connection.execute(
      "INSERT INTO profil (nama, email, password, age, gender) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, age, gender]
    );

    return header
      .response({
        status: "success",
        message: "Profil berhasil ditambahkan",
        insertedId: result.insertId,
      })
      .code(201);
  } catch (err) {
    console.error("Gagal menyimpan data:", err);

    return header
      .response({
        status: "fail",
        message: "Gagal menyimpan data",
      })
      .code(500);
  }
};

const login = async (request, header) => {
  try {
    const { email, password } = request.payload;

    const connection = await getConnection();
    const [result] = await connection.execute(
      "SELECT id, nama, email, age, gender, gambar_profil FROM profil WHERE email = ? AND password = ?",
      [email, password]
    );

    if (result.length === 0) {
      return header
        .response({
          status: "fail",
          message: `Email atau password salah.`,
        })
        .code(401);
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
    console.error("Terjadi kesalahan saat login:", err);

    return header
      .response({
        status: "error",
        message: "Gagal melakukan login.",
      })
      .code(500);
  }
};

module.exports = {
  register,
  login,
};
