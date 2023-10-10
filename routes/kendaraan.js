const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Middleware untuk mengelola file upload
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Jenis file tidak diizinkan'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Menampilkan data kendaraan
router.get("/", (req, res) => {
  connection.query("SELECT * FROM kendaraan", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Data Kendaraan",
        data: rows,
      });
    }
  });
});


router.get("/(:no_pol)", function (req, res) {
    let id = req.params.no_pol;
    connection.query(`SELECT * From kendaraan where id_m = ${id}`, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      }else {
        return res.status(200).json({
          status: true,
          message: "Data Mahasiswa",
          data: rows[0],
        });
      }
    });
  });

router.post('/kendaraan', upload.single('gambar_kendaraan'), (req, res) => {
    const { no_pol, nama_kendaraan, id_transmisi } = req.body;
    const gambar_kendaraan = req.file ? req.file.filename : null;
    const data = { no_pol, nama_kendaraan, id_transmisi, gambar_kendaraan };
  
    connection.query('INSERT INTO kendaraan SET ?', data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      } else {
        return res.status(201).json({
          status: true,
          message: 'Data Kendaraan telah ditambahkan',
          data: rows.insertId,
        });
      }
    });
  });
  router.patch('/update/:no_pol', upload.single("gambar_kendaraan"), [
    body('no_pol').notEmpty(),
    body('nama_kendaraan').notEmpty(),
    body('id_transmisi').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    
    const no_pol = req.params.no_pol; // Gunakan nomor polisi sebagai pengidentifikasi unik
    const gambar_kendaraan = req.file ? req.file.filename : null;

    connection.query(`SELECT * FROM kendaraan WHERE no_pol = ?`, [no_pol], function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }
        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            });
        }
        const namaFileLama = rows[0].gambar_kendaraan;

        if (namaFileLama && gambar_kendaraan) {
            const pathFileLama = path.join(__dirname, '../public/images', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }

        let dataToUpdate = {
            no_pol: req.body.no_pol,
            nama_kendaraan: req.body.nama_kendaraan,
            id_transmisi: req.body.id_transmisi,
            gambar_kendaraan: gambar_kendaraan
        };
        
        connection.query(`UPDATE kendaraan SET ? WHERE no_pol = ?`, [dataToUpdate, no_pol], function (err, rows) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Update Success..!'
                });
            }
        });
    });
});


  router.delete('/delete/(:no_pol)', (req, res) => {
    const no_pol = req.params.no_pol;
  
    connection.query('DELETE FROM kendaraan WHERE no_pol = ?', [no_pol], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data Kendaraan telah dihapus',
        });
      }
    });
  });
  





module.exports = router;
