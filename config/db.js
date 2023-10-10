const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "latihan14",
});

connection.connect(function (error) {
  if (!error) {
    console.log("Berhasil Terkoneksi");
  } else {
    console.log("Gagal Terkoneksi");
  }
});

module.exports = connection;
