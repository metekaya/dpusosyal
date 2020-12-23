const express = require('express');
const uygulama = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const Kullanici = require('../schemas/KullaniciSchema');

uygulama.set("view engine", "pug");
uygulama.set("views", "views");

uygulama.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {
    res.status(200).render("kayitol");
})

router.post("/", async (req, res, next) => {

    var ad = req.body.ad.trim();
    var soyad = req.body.soyad.trim();
    var kullaniciad = req.body.kullaniciad.trim();
    var email = req.body.email.trim();
    var sifre = req.body.sifre;
    
    var payload = req.body;
    
    if(ad && soyad && kullaniciad && email && sifre){
        var kullanici = await Kullanici.findOne({
            $or: [
                { kullaniciad: kullaniciad },
                { email: email}
            ]
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage = "Bir şeyler ters gitti.";
            res.status(200).render("kayitol", payload); 
        });
        
        if(kullanici == null){
            //Hiç kullanıcı yok ise..

            var data = req.body;

            data.sifre = await bcrypt.hash(sifre, 10);

            Kullanici.create(data)
            .then((kullanici) =>{
                req.session.kullanici = kullanici;
                return res.redirect("/");
            })
        }
        else {
            //kullanıcı var..
            if(email == kullanici.email){
                payload.errorMessage = "E Posta zaten kullanımda.";
            }
            else{
                payload.errorMessage = "Kullanıcı adı zaten kullanımda.";
            }
            res.status(200).render("kayitol", payload);
        }
    }
    else{
        payload.errorMessage = "Bütün alanların doğru bir şekilde doldurulduğundan emin olun.";
        res.status(200).render("kayitol", payload);

    }

    
})

module.exports = router;
