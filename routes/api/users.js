const express = require('express');
const uygulama = express();
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "uploads/ "});
const Kullanici = require('../../schemas/KullaniciSchema');
const Post = require('../../schemas/PostSchema');
const { ResumeToken } = require('mongodb');

uygulama.use(bodyParser.urlencoded({ extended: false}));

router.get("/", async (req, res, next) =>{
    var searchObj = req.query;

    if(req.query.search !== undefined){
        searchObj = {
            $or: [
                {ad: { $regex: req.query.search, $options: "i"}},
                {soyad: { $regex: req.query.search, $options: "i"}},
                {kullaniciad: { $regex: req.query.search, $options: "i"}},
            ]
        }
    }

    Kullanici.find(searchObj)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});

router.put("/:userId/follow", async (req, res, next) => {
    
    var userId = req.params.userId;

    var kullanici = await Kullanici.findById(userId);

    if (kullanici == null) return res.sendStatus(404);

    var isFollowing = kullanici.followers && kullanici.followers.includes(req.session.kullanici._id);
    var option = isFollowing ? "$pull": "$addToSet";

    req.session.kullanici = await Kullanici.findByIdAndUpdate(req.session.kullanici._id, { [option]: { following: userId } }, {new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    Kullanici.findByIdAndUpdate(userId, { [option]: { followers: req.session.kullanici._id } })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(req.session.kullanici);
    
})

router.get("/:userId/following", async (req, res, next) =>{
    Kullanici.findById(req.params.userId)
    .populate("following")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error =>{
        console.log(error);
        res.sendStatus(400);
    })
});

router.get("/:userId/followers", async (req, res, next) =>{
    Kullanici.findById(req.params.userId)
    .populate("followers")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error =>{
        console.log(error);
        res.sendStatus(400);
    })
});

router.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {
    if(!req.file){
        console.log("no file uploaded with ajax req");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error =>{
        if(error != null){
            console.log(error);
            return res.sendStatus(400);
        }

        var user = await Kullanici.findByIdAndUpdate(req.session.kullanici._id, {profilFoto: filePath}, {new: true})
        user = req.session.kullanici;
        res.sendStatus(204);
    })
});

router.post("/coverPhoto", upload.single("croppedImage"), async (req, res, next) => {
    if(!req.file){
        console.log("no file uploaded with ajax req");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error =>{
        if(error != null){
            console.log(error);
            return res.sendStatus(400);
        }

        var user = await Kullanici.findByIdAndUpdate(req.session.kullanici._id, {coverPhoto: filePath}, {new: true})
        user = req.session.kullanici;
        res.sendStatus(204);
    })
});

module.exports = router;

