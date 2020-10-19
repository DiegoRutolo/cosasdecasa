const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const u = require('./utils');

const PORT = 10886;

// Instancia de server
const app = express();
// Configurar server para aceptar JSON
app.use(express.json());

// Conectar a MongoDB
mongoose
.connect(u.getConnString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    auth: {authSource: "admin"},
    user: u.getSecret("mongo_user_name"),
    pass: u.getSecret("mongo_user_passwd")
})
.then(() => console.log("Conectado a MongoDB"))
.catch((err) => console.log(err));

// Iniciar el server
app.listen(PORT, () => console.log("Server iniciado"));

// Importar esquemas
const Lista = require('./models/Lista');
const Casa = require('./models/Casa');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");

//#region Casas
// Crear Casas
app.post("/casa", function(req, res) {
    const casa = new Casa(req.body);

    if (!casa.nombre) {
        return res.status(400).json({msg: "Falta el nombre"});
    }

    casa.save(function(err, newCasa) {
        if (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }

        res.status(201)
            .header("Location", "/casa/"+newCasa._id)
            .json({msg: "Casa creada"});
    });
});

// Ver datos de la casa
app.get("/casa/:casaID", function(req, res) {
    Casa.findById(req.params.casaID, function(err, docCasa) {
        if (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }

        if (!docCasa) {
            return res.status(404).json({msg: "Casa not found"});
        }

        return res.status(200).json({data: docCasa});
    });
});

// Actualizar datos de la casa
app.put("/casa/:casaID", function(req, res) {
    Casa.findById(req.params.casaID, function(err, docCasa) {
        if (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }

        if (!docCasa) {
            return res.status(404).json({msg: "Casa not found"});
        }

        if (req.body.nombre) {
            docCasa.nombre = req.body.nombre;
        }
        if (req.body.descr) {
            docCasa.descr = req.body.descr;
        }

        docCasa.save(function(err, prod) {
            if (err) {
                return res.status(500)
                    .json({error: err.message});
            }

            res.status(200).json({msg: "Casa actualizada"});
        });
    });
});

app.delete("/casa/:casaID", function(req, res) {
    Casa.findByIdAndDelete(req.params.casaID, function(err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }

        res.status(200).json({msg: "Casa eliminada"});
    });
});
//#endregion

//#region Lista
// Crear lista
app.post("/casa/:casaID/lista", function(req, res) {
    Casa.findById(req.params.casaID, function(err, casa) {
        if (err) {
            return res.status(404).json({msg: "Casa not found"});
        }

        casa.listas.push(req.body);
        casa.save(function(err, prod) {
            if (err) {
                console.err(err);
                return res.status(500).json({error: err.message});
            }
            
            res.status(201).json({msg: "Lista guardada"});
        });
    });
});

// Añadir item a lista
app.put("/casa/:casaID/lista/:listaID", function(req, res) {
    
});
//#endregion
