const express = require('express');
const uygulama = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Kullanici = require('../schemas/KullaniciSchema');

router.get("/", (req, res, next) => {
    var payload = {
        sayfaAdi: req.session.kullanici.kullaniciad,
        userLoggedIn: req.session.kullanici,
        userLoggedInJs: JSON.stringify(req.session.kullanici),
        profileUser: req.session.kullanici,
    }

    res.status(200).render("profilePage", payload);
})

router.get("/:kullaniciad", async (req, res, next) => {

    var payload = await getPayload(req.params.kullaniciad, req.session.kullanici);

    res.status(200).render("profilePage", payload);
})

router.get("/:kullaniciad/yanitlar", async (req, res, next) => {

    var payload = await getPayload(req.params.kullaniciad, req.session.kullanici);
    payload.selectedTab = "yanitlar";
    res.status(200).render("profilePage", payload);
})

router.get("/:kullaniciad/following", async (req, res, next) => {

    var payload = await getPayload(req.params.kullaniciad, req.session.kullanici);
    payload.selectedTab = "following";
    
    res.status(200).render("followPage", payload);
})

router.get("/:kullaniciad/followers", async (req, res, next) => {

    var payload = await getPayload(req.params.kullaniciad, req.session.kullanici);
    payload.selectedTab = "followers";
    
    res.status(200).render("followPage", payload);
})

async function getPayload(kullaniciad, userLoggedIn){
    var kullanici = await Kullanici.findOne({kullaniciad: kullaniciad});
    
    if(kullanici == null){

        kullanici = await Kullanici.findById(kullaniciad);

        if (kullanici == null){
            return{
                sayfaAdi: "Kullanıcı bulunamadı",
                userLoggedIn: userLoggedIn,
                userLoggedInJs: JSON.stringify(userLoggedIn),
            }
        }
    }

    return{
        sayfaAdi: kullanici.kullaniciad,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: kullanici,
    }
}

module.exports = router;

