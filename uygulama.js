const express = require('express');
const uygulama = express();
const port = 4004;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("./veritabani");
const session = require("express-session");

const server = uygulama.listen(port, () => console.log("Sunucu " + port +" numarali port'u dinliyor."));

uygulama.set("view engine", "pug");
uygulama.set("views", "views");

uygulama.use(bodyParser.urlencoded({ extended: false}));
uygulama.use(express.static(path.join(__dirname, "public")));

uygulama.use(session({
    secret: "taze fasulye",
    resave: true,
    saveUninitialized: false //ss
}))


//Routes
const girisRoute = require('./routes/girisRoutes');
const kayitRoute = require('./routes/kayitRoutes');
const cikisRoute = require('./routes/cikis');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');
const uploadRoute = require('./routes/uploadRoutes');
const searchRoute = require('./routes/searchRoutes');


//Api Routes
const postsApiRoute = require('./routes/api/posts');
const usersApiRoute = require('./routes/api/users');

//Uses
uygulama.use("/girisyap", girisRoute);
uygulama.use("/kayitol", kayitRoute);
uygulama.use("/cikis", cikisRoute);
uygulama.use("/posts", middleware.girisGerekli, postRoute);
uygulama.use("/profil", middleware.girisGerekli, profileRoute);
uygulama.use("/uploads", uploadRoute);
uygulama.use("/arama", middleware.girisGerekli, searchRoute);


//Api uses
uygulama.use("/api/posts", postsApiRoute);
uygulama.use("/api/users", usersApiRoute);

uygulama.get("/", middleware.girisGerekli, (req, res, next) => {

    var payload = {
        sayfaAdi: "Anasayfa",
        userLoggedIn: req.session.kullanici,
        userLoggedInJs: JSON.stringify(req.session.kullanici),
    }

    res.status(200).render("anasayfa", payload);
})
