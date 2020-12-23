const express = require('express');
const uygulama = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Kullanici = require('../schemas/KullaniciSchema');

router.get("/", (req, res, next) => {
    var payload = createPayload(req.session.kullanici)

    res.status(200).render("searchPage", payload);
})

router.get("/:selectedTab", (req, res, next) => {
    var payload = createPayload(req.session.kullanici)
    payload.selectedTab = req.params.selectedTab;
    res.status(200).render("searchPage", payload);
})

function createPayload(userLoggedIn){
    return{
        sayfaAdi: "Ara",
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
    }
}

module.exports = router;

