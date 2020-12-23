const express = require('express');
const uygulama = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");
const Kullanici = require('../schemas/KullaniciSchema');

router.get("/images/:path", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
})

module.exports = router;

