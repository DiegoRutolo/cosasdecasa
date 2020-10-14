# Cosas de Casa

REST API para listas de la compra y otras chorradas útiles

## Peticiones HTTP

Descipción de todas las opciones

### GET
 + **/listas** : Devuelve todas las listas
 + **/listas/{UNAIDCUALQUIERA}** : Devuelve la lista con esa ID


### POST
Crea una lista nueva. Cuerpo en JSON (ver *Estructura Mongo*). Devuelve 201 y una cabecera 'Location' con la id.

### PUT
Actualizar listas

 + **/listas/UNAIDCUALQUIERA** : Actualiza el nombre y la descripción. Los datos van en el cuerpo, como en POST.
 + **/listas/UNAIDCUALQUIERA/items** : Añade un item nuevo. Los datos van en el cuerpo de la petición en formato JSON (ver *Estructura Mongo*).
 
### DELETE

Elimina el elemento indicado
 + **/listas/UNAIDCUALQUIERA** : Elimina la lista entera
 + **/listas/UNAIDCUALQUIERA/IDITEM** : Elimina el item de la lista
## Secretos

La carpeta secrets contiene archivos de texto con las credenciales de la base de datos.
Un archivo por secreto, en texto plano, sin espacios ni lineas extra. Estos son los nombres utilizados:
 + mongo_user_name
 + mongo_user_passwd


## Estructura Mongo

**Lista**
```
{
    nombre: "Compra",
    descr: "Comida para comprar"
    items: {[
        {
            nom: "Salsa de tomate",
            descr: "Solis"
        }, {
            nom: "Sal",
            descr: "Gorda"
        }
    ]}
}
```