const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

class Veritabani {

    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect("mongodb+srv://admin:admin123@sosyalmedya.1boys.mongodb.net/SosyalMedyaDB?retryWrites=true&w=majority")
        .then(() =>{
            console.log("Veritabanı bağlantısı başarılı.");
        })
        .catch((err) =>{
            console.log("Veritabanı bağlantısı başarısız."+err);
        })
    }
}
module.exports = new Veritabani();