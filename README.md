# Cosas de Casa

REST API para listas de la compra y otras chorradas útiles


## Secretos

La carpeta secrets contiene archivos de texto con las credenciales de la base de datos.
Un archivo por secreto, en texto plano, sin espacios ni lineas extra. Estos son los nombres utilizados
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