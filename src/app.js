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
// Crear Casa
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
        if (err || !docCasa) {
            return res.status(404).json({msg: "Casa not found"});
        }

        return res.status(200).json(docCasa);
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

// Eliminar casa
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

// Ver lista
app.get("/casa/:casaID/lista/:listaID", function(req, res) {
    Casa.findById(req.params.casaID, function(err, casa) {
        if (err) {
            return res.status(404).json({msg: "Casa not found"});
        }

        var lista;
        var flag_listaEncontrada = false;
        for (const l of casa.listas) {
            if (l._id == req.params.listaID) {
                lista = l;
                flag_listaEncontrada = true;
                break;
            }
        }

        if (!flag_listaEncontrada) {
            return res.status(404).json({msg: "Lista not found"});
        }

        return res.status(200).json(lista);

    });
});

// Editar lista
app.put("/casa/:casaID/lista/:listaID", function(req, res) {
    Casa.findById(req.params.casaID, function(err, casa) {
        if (err) {
            return res.status(404).json({msg: "Casa not found"});
        }

        // Seguro que esto se puede mejorar, pero no se como
        var flag_editado = false
        for (const lista of casa.listas) {
            if (lista._id == req.params.listaID) {
                lista.nombre = req.body.nombre ? req.body.nombre : lista.nombre;
                lista.descr = req.body.descr ? req.body.descr : lista.descr;
                flag_editado = true;
                break;
            }
        }

        if (!flag_editado) {
            return res.status(404).json({msg: "Lista not found"});
        }
        
        casa.save(function(err, prod) {
            if (err) {
                console.err(err);
                return res.status(500).json({error: err.message});
            }
            
            return res.status(200).json({msg: "Lista actualizada"});
        });
    });
});

// Eliminar lista
app.delete("/casa/:casaID/lista/:listaID", function(req, res) {
    Casa.findById(req.params.casaID, function(err, casa) {
        if (err) {
            return res.status(404).json({msg: "Casa not found"});
        }

        var flag_lista = false;
        var lista;
        for (const l of casa.listas) {
            if (l._id == req.params.listaID) {
                lista = l;
                flag_lista = true;
                break;
            }
        }
        if (!flag_lista) {
            return res.status(404).json({msg: "Lista not found"});
        }

        casa.listas = casa.listas.filter(l => l != lista);

        casa.save(function(err, prod) {
            if (err) {
                console.err(err);
                return res.status(500).json({error: err.message});
            }
            
            return res.status(200).json({msg: "Lista eliminada"});
        });
    });
});
//#endregion

//#region Items
// Añadir item a lista
app.put("/casa/:casaID/lista/:listaID/item", function(req, res) {
    Casa.findById(req.params.casaID, function(err, casa) {
        if (err) {
            return res.status(404).json({msg: "Casa not found"});
        }

        var flag_editado = false
        for (const lista of casa.listas) {
            if (lista._id == req.params.listaID) {
                lista.items.push(req.body);

                flag_editado = true;
                break;
            }
        }

        if (!flag_editado) {
            return res.status(404).json({msg: "Lista not found"});
        }
        
        casa.save(function(err, prod) {
            if (err) {
                console.err(err);
                return res.status(500).json({error: err.message});
            }
            
            return res.status(200).json({msg: "Lista actualizada"});
        });
    });
});

// Eliminar item de lista
app.delete("/casa/:casaID/lista/:listaID/item/:itemID", function(req, res) {
    Casa.findById(req.params.casaID, function(err, casa) {
        if (err) {
            return res.status(404).json({msg: "Casa not found"});
        }
        
        var flag_lista = false
        var flag_item = false
        
        var listaObj, itemObj;
        // Encontramos la lista
        for (const l of casa.listas) {
            if (l._id == req.params.listaID) {
                listaObj = l;
                flag_lista = true;
                break;
            }
        }
        if (!flag_lista) {
            return res.status(404).json({msg: "Lista not found"});
        }

        // encontramos el item
        for (const i of listaObj.items) {
            if (i._id == req.params.itemID){
                itemObj = i;
                flag_item = true;
                break;
            }
        }
        if (!flag_item) {
            return res.status(404).json({msg: "Item not found"});
        }

        // encontramos el item
        listaObj.items = listaObj.items.filter(item => item != itemObj);
        
        casa.save(function(err, prod) {
            if (err) {
                console.err(err);
                return res.status(500).json({error: err.message});
            }
            
            return res.status(200).json({msg: "Lista actualizada"});
        });
    });
});
//#endregion
