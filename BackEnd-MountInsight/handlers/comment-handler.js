const getConnection = require('../db');

// Create comment
const addComment = async (request, h) => {
  try {
      const { profil_id, gunung_id, isi_comment } = request.payload;
      
      const connection = await getConnection();

      const [result] = await connection.execute(
      'INSERT INTO comment (profil_id, gunung_id, isi_comment) VALUES (?, ?, ?)',
      [profil_id, gunung_id, isi_comment]
    );

    return h.response({
      status: 'success',
      message: 'Komentar berhasil ditambahkan',
      insertedId: result.insertId
    }).code(201);

  } catch (err) {
    console.error(err);
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan komentar'
    }).code(500);
  }
};

// Get comments by gunung_id
const getCommentsByGunung = async (request, h) => {
  try {
    const { gunung_id } = request.params;

    const connection = await getConnection();
      
    const [rows] = await connection.execute(
      `SELECT c.id_comment, c.isi_comment, c.created_at, p.NAMA AS nama_user
       FROM comment c
       JOIN profil p ON c.profil_id = p.ID
       WHERE c.gunung_id = ?
       ORDER BY c.created_at DESC`,
      [gunung_id]
    );

    return h.response({
      status: 'success',
      data: rows
    }).code(200);

  } catch (err) {
    console.error(err);
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil komentar'
    }).code(500);
  }
};

// Delete comment by id_comment
const deleteComment = async (request, h) => {
  try {
      const { id_comment } = request.params;
      
      const connection = await getConnection();

      const [result] = await connection.execute(
      'DELETE FROM comment WHERE id_comment = ?',
      [id_comment]
    );

    if (result.affectedRows === 0) {
      return h.response({
        status: 'fail',
        message: `Komentar dengan ID ${id_comment} tidak ditemukan`
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Komentar berhasil dihapus'
    }).code(200);

  } catch (err) {
    console.error(err);
    return h.response({
      status: 'fail',
      message: 'Gagal menghapus komentar'
    }).code(500);
  }
};

module.exports = {
  addComment,
  getCommentsByGunung,
  deleteComment
};
