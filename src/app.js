const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const PORT = 10886;

// funciones para leer credenciales
function getSecret(fileName) {
    return fs.readFileSync("/run/secrets/" + fileName, 'utf8');
}

function getConnString() {
    var cs = "mongodb://";
    cs += getSecret("mongo_user_name");
    cs += ":";
    cs += getSecret("mongo_user_passwd");
    cs += "@mongo:27017/cosasdecasa";

    cs = "mongodb://mongo:27017/cosasdecasa"

    // console.log(cs);
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
        useUnifiedTopology: true,
        auth: {authSource: "admin"},
        user: getSecret("mongo_user_name"),
        pass: getSecret("mongo_user_passwd")
    })
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.log(err));

// Iniciar el server
app.listen(PORT, () => console.log("Server iniciado"));


// Importar el esquema de Lista
const Lista = require("./models/Lista");

// Funcion para manejar GET
app.get("/listas", function(req, res) {
    // console.log("Recibido GET");

    Lista.find(function(err, listas) {
        if (err) {
            return res.status(500).json({error: err.message});
        }

        res.status(200).json({listas: listas})
    });
});

// Funcion POST
app.post("/listas", function(req, res) {
    // console.log("Recibido POST");

    const lista = new Lista({
        nombre: req.body.nombre,
        descr: req.body.descr,
        items: req.body.items
    });

    lista.save(function(err, newLista) {
        if (err) {
            console.err(err);
            return res.status(500).json({error: err.message});
        }
        res.status(200).json({msg: "Lista guardada"});
    });
});