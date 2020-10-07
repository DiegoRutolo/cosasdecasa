const mongoose = require("mongoose");

const ListaSchema = new mongoose.Schema({
    nombre: String,
    descr: String,
    items: [{
        nom: String,
        descr: String
    }]
});

module.exports = mongoose.model("Lista", ListaSchema);
