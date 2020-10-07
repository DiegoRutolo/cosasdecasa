const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const PORT = 10886;

// funciones para leer credenciales
function getSecret(fileName) {
    fs.readFile("/run/secrets/" + fileName, 'utf8', (err, data) => {
        if (err) {
            console.err(err);
            return;
        }

        return data;
    });
}

function getConnString() {
    var cs = "mongodb://";
    cs += getSecret("mongo_user_name");
    cs += ":";
    cs += getSecret("mongo_user_passwd");
    cs += "@mongo/cosasdecasa";

    console.log(cs);
    return cs;
}

// Instancia de server
const app = express();
// Configurar server para aceptar JSON
app.use(express.json());

// Conectar a MongoDB
mongoose
    .connect(getConnString(), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.log(err));

// Iniciar el server
app.listen(PORT, () => console.log("Server iniciado"));


// Importar el esquema de Lista
const Lista = require("./models/Lista");

app.get("/listas", function(req, res) {
    Lista.find(function(err, listas) {
        if (err) {
            return res.status(500).json({error: err.message});
        }

        res.status(200).json({listas: listas})
    });
});