const mongoose = require("mongoose");

const CasaSchema = new mongoose.Schema({
    nombre: String,
    descr: String,
    admin: {
        Type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model("Casa", CasaSchema);
