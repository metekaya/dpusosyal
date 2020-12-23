const express = require('express');
const uygulama = express();
const router = express.Router();
const bodyParser = require("body-parser");
const Kullanici = require('../../schemas/KullaniciSchema');
const Post = require('../../schemas/PostSchema');
const { ResumeToken } = require('mongodb');

uygulama.use(bodyParser.urlencoded({ extended: false}));

router.get("/", async (req, res, next) => {

    var searchObj  = req.query;

    if(searchObj.isReply !== undefined){
        var isReply = searchObj.isReply == "true";
        searchObj.replyTo = { $exists: isReply};
        delete searchObj.isReply;  
    }

    if(searchObj.search != undefined){
        searchObj.content = { $regex: searchObj.search, $options: "i"};
        delete searchObj.search; 
    }

    if(searchObj.followingOnly !== undefined){
        var followingOnly = searchObj.followingOnly == "true";

        if(followingOnly) {
            var objectIds = [];
            
            if(!req.session.kullanici.following) {
                req.session.kullanici.following = [];
            }
            
            req.session.kullanici.following.forEach(kullanici =>{
                objectIds.push(kullanici);
            })

            objectIds.push(req.session.kullanici._id);
            searchObj.postedBy = { $in: objectIds};
        }

        delete searchObj.followingOnly;
    }

    var results = await getPosts(searchObj);
    res.status(200).send(results);
})

router.get("/:id", async (req, res, next) => {
    
    var postId = req.params.id;
    
    var postData = await getPosts({_id: postId});
    postData = postData[0];
    
    var results = {
        postData: postData
    }

    if(postData.replyTo !== undefined){
        results.replyTo = postData.replyTo
    }

    results.replies = await getPosts({replyTo: postId});

    res.status(200).send(results);
})

router.post("/", async (req, res, next) => {
    if(!req.body.content){
        console.log("İçerik parametresi isteğe uygun gönderilemedi.")
        return res.sendStatus(400)
    }

    var postData = {
        content: req.body.content,
        postedBy: req.session.kullanici
    }

    if(req.body.replyTo){
        postData.replyTo = req.body.replyTo;
    }

    Post.create(postData)
    .then(async newPost =>{
        newPost = await Kullanici.populate(newPost, {path: "postedBy"})

        res.status(201).send(newPost);
    })
    .catch((error) =>{
        console.log(error);
        res.sendStatus(400);
    })
})

router.put("/:id/like", async (req, res, next) => {

    var postId = req.params.id;
    var userId = req.session.kullanici._id;

    var isLiked = req.session.kullanici.likes && req.session.kullanici.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";

    // Insert user like
    req.session.kullanici = await Kullanici.findByIdAndUpdate(userId, { [option]: { likes: postId } }, {new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId} }, {new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post)
})

router.post("/:id/retweet", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.kullanici._id;

    // Try and delete retweet
    var deletedPost = await Post.findOneAndDelete({postedBy: userId, retweetData: postId})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    }) 

    var option = deletedPost != null ? "$pull" : "$addToSet";

    var repost = deletedPost;

    if (repost == null){
        repost = await Post.create({postedBy: userId, retweetData: postId})
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    }

    // Insert user like
    req.session.kullanici = await Kullanici.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, {new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId} }, {new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(post)
})

router.delete("/:id", (req, res, next) =>{
    Post.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(202))
    .catch(error =>{
        console.log(error);
        res.sendStatus(400);
    })
})

async function getPosts(filter){
    var results = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({"createdAt": -1})
    .catch(error => console.log(error))

    results = await Kullanici.populate(results, {path: "replyTo.postedBy"});
    return await Kullanici.populate(results, {path: "retweetData.postedBy"});
}

module.exports = router;

