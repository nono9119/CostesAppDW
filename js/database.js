// Funcion para crear la base de datos al cargar
window.onload = function() {
    /***********************************************************************************************
    *** Creo correctamente para evitar errores inesperados el objeto indexedDB
    *** que contiene todos los metodos y propiedades necesarias
    ***********************************************************************************************/
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
        window.msIndexedDB;
    /***********************************************************************************************
    *** En la variable dataBase almacenaremos el conector abierto a nuestra base de datos,
    *** con open si no existe la base de datos, se crea
    ***********************************************************************************************/
    dataBase = indexedDB.open("CostesAppDB", 1);
    /***********************************************************************************************
    *** Para crear una coleccion de objetos se utiliza la propiedad onupgradeneeded,
    *** para usarla hay que definirla como metodo para el objeto database,
    *** este metodo se ejecutara tanto cuando la base de datos se crea por primera vez como
    *** cuando abrimos una bbdd, pero especificando una version diferente a la almacenada
    ***********************************************************************************************/
    dataBase.onupgradeneeded = function (e) {
        // Recupero el conector a la base de datos
        active = dataBase.result;
        // Una coleccion de objetos aqui es como una tabla
        // Coleccion Materiales
        materiales = active.createObjectStore("materiales",
            { keyPath : 'id_material', autoIncrement : true });
        //materiales.createIndex('id_material', 'id_material', { unique : true });
        // Coleccion Mano de Obra
        mdObra = active.createObjectStore("mdobra",
            { keyPath : 'id_mdobra', autoIncrement : true });
        //mdObra = createIndex('id_mdobra', 'id_mdobra', { unique : true });
        // Coleccion Presupuesto
        presupuesto = active.createObjectStore("presupuesto",
            { keyPath : 'id_presupuesto', autoIncrement : true });
        //presupuesto = createIndex('id_presupuesto', 'id_presupuesto', { unique : true });
    };
    /*
    dataBase.onsuccess = function (e) {
        alert('Base de datos cargada correctamente');
    };
    dataBase.onerror = function (e)  {
        alert('Error cargando la base de datos');
    };
    */
};