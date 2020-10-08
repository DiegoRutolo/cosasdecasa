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

// Funciones GET
app.get("/listas", function(req, res) {
    console.log("Recibido GET");

    // Comprobamos si hay parametros get
    if (req.query.listaID != null) {
        Lista.findById(req.query.listaID, function(err, listaResult) {
            if (err) {
                return res.status(500).json({error: err.message});
            }

            if (listaResult == null) {
                return res.status(204).json({listas: ""});
            }

            return res.status(200).json({listas: listaResult});
        });
    } else {
        Lista.find(function(err, listas) {
            if (err) {
                return res.status(500).json({error: err.message});
            }

            return res.status(200).json({listas: listas});
        });
    }
});

// Funcion GET por id
 app.get("/listas/:listaID", function(req, res) {
     console.log("Redibido GET by ID");

     Lista.findById(req.params.listaID, function(err, listRestult) {
         if (err) {
             console.error(err);
             return res.status(500).json({error: err.message});
         }

         if (listRestult == null) {
             return res.status(204).json({lista: ""});
         }
         return res.status(200).json({lista: listRestult});
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
        res.status(201).header("Location", "/listas/"+newLista._id).json({msg: "Lista guardada"});
    });
});

