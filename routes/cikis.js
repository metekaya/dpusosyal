const express = require('express');
const uygulama = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Kullanici = require('../schemas/KullaniciSchema');


uygulama.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {

    if(req.session){
        req.session.destroy(()=>{
            res.redirect("/girisyap");
        }) 
    }
})

module.exports = router;

