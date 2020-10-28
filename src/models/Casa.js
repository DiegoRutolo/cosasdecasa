const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    nom: String,
    descr: String
});

const listaSchema = new mongoose.Schema({
    nombre: String,
    descr: String,
    items: [itemSchema]
});

const CasaSchema = new mongoose.Schema({
    nombre: String,
    descr: String,
    listas: [listaSchema]
});

module.exports = mongoose.model("Casa", CasaSchema, "casas");
