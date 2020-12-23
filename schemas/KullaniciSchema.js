const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const KullaniciSchema = new Schema({
    ad: {type: String, required: true, trim: true},
    soyad: {type: String, required: true, trim: true},
    kullaniciad: {type: String, required: true, trim: true, unique: true},
    email: {type: String, required: true, trim: true, unique: true},
    sifre: {type: String, required: true},
    profilFoto: {type: String, default: "/images/profilFoto.png"},
    coverPhoto: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    retweets: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    following: [{type: Schema.Types.ObjectId, ref: 'Kullanici'}],
    followers: [{type: Schema.Types.ObjectId, ref: 'Kullanici'}]
    
},{ timestamps: true});

var Kullanici = mongoose.model('Kullanici', KullaniciSchema);
module.exports = Kullanici;