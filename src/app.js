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
        useFindAndModify: false,
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

//#region Lista
// Funciones GET
app.get("/listas", function(req, res) {
    console.log("Recibido GET");

    Lista.find(function(err, listas) {
        if (err) {
            return res.status(500).json({error: err.message});
        }

        return res.status(200).json({listas: listas});
    });
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

    if (lista.nombre == null) {
        return res.status(400).json({msg: "Falta el nombre"});
    }

    lista.save(function(err, newLista) {
        if (err) {
            console.err(err);
            return res.status(500).json({error: err.message});
        }
        res.status(201)
            .header("Location", "/listas/"+newLista._id)
            .json({msg: "Lista guardada"});
    });
});

// Funcion PUT
app.put("/listas/:listaID", function(req, res) {
    console.log("Redibico PUT");

    Lista.findById(req.params.listaID, function(err, lista) {
        if (err) {
            return res.status(500)
                .json({error: err.message});
        }

        if (req.body.nombre != null) {
            lista.nombre = req.body.nombre;
        }
        if (req.body.descr != null) {
            lista.descr = req.body.descr;
        }

        lista.save(function(err, prod) {
            if (err) {
                return res.status(500)
                    .json({error: err.message});
            }

            res.status(200).json({msg: "Lista actualizada"});
        });
    });
});

// Funcion PUT para items
app.put("/listas/:listaID/items", function(req, res) {
    console.log("Recibido PUT item");

    Lista.findById(req.params.listaID, function(err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }

        result.items.push(req.body);
        result.save(function(err2, prod) {
            if (err2) {
                console.error(err2);
                return res.status(500).json({error: err2.message});
            }

            res.status(200).json({msg: "Añadido elemento"});
        });
    });
});

// Funcion DELETE
app.delete("/listas/:listaID", function(req, res) {
    console.log("Redibido DELETE");

    Lista.findByIdAndDelete(req.params.listaID, function(err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }

        res.status(200).json({msg: "Lista eliminada"});
    });
});

// Funcion DELETE item
app.delete("/listas/:listaID/:itemID", function(req, res) {
    console.log("Redibido DELETE item");

    Lista.updateOne(
        {_id: req.params.listaID},
        {$pull: {items: {_id: req.params.itemID}}},
        function(err, raw) {
            if (err) {
                console.error(err);
                return res.status(500).json({error: err.message});
            }
    
            res.status(200).json({msg: "Elemento eliminado"});
        });
});
//#endregion

//#region Usuarios
//#endregion

//#region Casas
//#endregion