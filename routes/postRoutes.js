const express = require('express');
const uygulama = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Kullanici = require('../schemas/KullaniciSchema');

router.get("/:id", (req, res, next) => {
    var payload = {
        sayfaAdi: "Gönderiyi görüntüle",
        userLoggedIn: req.session.kullanici,
        userLoggedInJs: JSON.stringify(req.session.kullanici),
        postId: req.params.id
    }

    res.status(200).render("postPage", payload);
})

module.exports = router;

