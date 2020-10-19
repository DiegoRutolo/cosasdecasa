const mongoose = require("mongoose");

const CasaSchema = new mongoose.Schema({
    nombre: String,
    descr: String,
    listas: [{
        nombre: String,
        descr: String,
        items: [{
            nom: String,
            descr: String
        }]
    }]
});

module.exports = mongoose.model("Casa", CasaSchema, "casas");
