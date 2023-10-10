const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db");
    
router.get("/", function (req, res) {
    connection.query(
      "select * from transmisi",
     function (err, rows) {
      if (err) {
        console.error(err); 
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data Transmisi",
          data: rows,
        });
      }
    });
  });

  
router.post(
    "/store",
    [
      body("nama_transmisi").notEmpty(),
    ],
    (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).json({
          error: error.array(),
        });
      }
      let Data = {
        nama_transmisi: req.body.nama_transmisi,
        
      };
      connection.query("INSERT into transmisi set ? ", Data, function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server Error",
          });
        } else {
          return res.status(201).json({
            status: true,
            message: "Sukses..!",
            data: rows[0],
          });
        }
      });
    }
  );

  
router.get("/(:id_transmisi)", function (req, res) {
    let id = req.params.id_transmisi;
    connection.query(`SELECT * From transmisi where id_transmisi = ${id}`, function (err, rows) {
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
          message: "Data Transmisi",
          data: rows[0],
        });
      }
    });
  });

  

router.patch("/update/:id_transmisi", [
  body("nama_transmisi").notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
id = req.params.id_transmisi;
  connection.query(`SELECT * FROM transmisi WHERE id_transmisi = ${id}`, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Not Found",
      });
    }

    let Data = {
      nama_transmisi: req.body.nama_transmisi,
    };

    connection.query(`UPDATE transmisi SET ? WHERE id_transmisi = ${id}`, Data, function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Update Sukses..!",
        });
      }
    });
  });
});
  

router.delete("/delete/(:id_transmisi)", function (req, res) {
    const id = req.params.id_transmisi;
  
    connection.query(`delete FROM transmisi WHERE id_transmisi = ${id}`, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      }
  
      
  
    }
    );
  });
  
  module.exports = router;