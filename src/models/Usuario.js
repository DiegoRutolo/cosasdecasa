const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
    username: String,
    passwd: String,
    casas_acceso: {
        Type: mongoose.Schema.Types.ObjectId,
        ref: 'Casa'
    }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
