const {
  addComment,
  getCommentsByGunung,
  deleteComment,
} = require("../handlers/comment-handler");

module.exports = [
  {
    method: "POST",
    path: "/comments",
    handler: addComment,
  },
  {
    method: "GET",
    path: "/comments/gunung/{gunung_id}",
    handler: getCommentsByGunung,
  },
  {
    method: "DELETE",
    path: "/comments/{id_comment}",
    handler: deleteComment,
  },
];
