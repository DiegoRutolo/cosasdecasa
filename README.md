REST API para listas de la compra y otras chorradas útiles

# Operaciones

## Crear casa
 > POST /casa

El cuerpo contiene los datos de la casa en JSON. Todos son opcionales. La respuesta contiene una cabecera `Location` con la ID de la casa a través de la cual se pueden acceder a los datos

## Ver datos de casa
 > GET /casa/:casaID

## Editar casa
 > PUT /casa/:casaID

El cuerpo contiene el `nombre` y `descr`. No se pueden editar otros datos para evitar borrados accidentales.

## Eliminar casa
 > DELETE /casa/:casaID

## Crear lista
 > POST /casa/:casaID/lista

Los datos de la lista en el cuerpo en JSON. Puede contener items o no.

## Ver lista
 > GET /casa/:casaID

## Editar datos de la lista
 > PUT /casa/:casaID/lista/:listaID

Datos en JSON en el cuerpo. Solo se puede editar `nombre` y `descr`.

## Añadir elementos a la lista
 > PUT /casa/:casaID/lista/:listaID/item

Datos en el cuerpo en JSON.

## Eliminar elementos de la lista
 > DELETE /casa/:casaID/lista/:listaID/item/:itemID


# Secretos

La carpeta secrets contiene archivos de texto con las credenciales de la base de datos.
Un archivo por secreto, en texto plano, sin espacios ni lineas extra. Estos son los nombres utilizados:
 + **mongo_user_name** : Nombre de usuario de la base de datos
 + **mongo_user_passwd** : Contraseña del usuario de la base de datos   
 + **salt** : Cadena aleatoria. Se puede generar con `openssl rand -hex 16 > secrets/salt` o cualquier otro método.


# Estructura Mongo

 + Cualquiera puede crear una casa
 + Cada case se configura a través de la ID, quien la conozca tiene acceso

> TODO:
> + Usuario > crea casa > autoriza otros usuarios
> + Usuario > crea lista en casa


**Lista**
```
{
    nombre: "Compra",
    descr: "Comida para comprar"
    items: [
        {
            nom: "Salsa de tomate",
            descr: "Solis"
        },
        {
            nom: "Sal",
            descr: "Gorda"
        }
    ]
}
```

**Casa**
```
{
    nombre: "Rosalia 3",
    descr: "Una casa grande",
    admin_id: "IDUSUARIO"
}
```

**Usuario**
```
{
    username: "Pedrito",
    passwd: "abc123.",
    casas_acceso: [
        "4fdg5",
        "8kfj34"
    ]
}
```

# Links

 + http://www.passportjs.org/docs/authenticate/