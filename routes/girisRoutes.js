const express = require('express');
const uygulama = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Kullanici = require('../schemas/KullaniciSchema');

uygulama.set("view engine", "pug");
uygulama.set("views", "views");

uygulama.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {
    res.status(200).render("girisyap");
})

router.post("/", async (req, res, next) => {

    var payload = req.body;

    if(req.body.kullaniciAdiGir && req.body.sifreGir){
        var kullanici = await Kullanici.findOne({
            $or: [
                { kullaniciad: req.body.kullaniciAdiGir },
                { email: req.body.kullaniciAdiGir}
            ]
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage = "Bir şeyler ters gitti.";
            res.status(200).render("girisyap", payload); 
        });

        if(kullanici != null){
            var result = await bcrypt.compare(req.body.sifreGir, kullanici.sifre)
            
            if(result === true){
                req.session.kullanici = kullanici;
                return res.redirect("/");
            }   
           
        }
        payload.errorMessage = "Giriş bilgileri yanlış.";
        return res.status(200).render("girisyap", payload); 

    }

    payload.errorMessage = "Bütün alanların düzgün bir şekilde doldurulduğundan emin olun.";
    res.status(200).render("girisyap");
})

module.exports = router;

