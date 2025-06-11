const getConnection = require('../db');

const getMountainById = async (request, header) => {
    try {
        const { id } = request.params;

        const connection = await getConnection();

        const [result] = await connection.execute(
            'SELECT nama, deskripsi, gambar from list_gunung WHERE id = ?',
            [id]
        );

        if (result.length === 0) {
            return header.response({
              status: 'fail',
              message: `Gunung dengan ID ${id} tidak ditemukan`,
            }).code(404);
          }
      
          const mountain = result[0];
      
          return header.response({
            status: 'success',
            data: {
              mountain,
            },
          }).code(200);
        } catch (err) {
          console.error('Terjadi kesalahan:', err);
          return header.response({
            status: 'error',
            message: 'Gagal mengambil Gunung',
          }).code(500);
        }
};
      
module.exports = { getMountainById };