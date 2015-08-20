/***********************************************************************************************
*** Creo correctamente para evitar errores inesperados el objeto indexedDB
*** que contiene todos los metodos y propiedades necesarias
***********************************************************************************************/
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
	window.msIndexedDB;
var dataBase = null;
/***********************************************************************************************
*** Crear la base de datos al cargar
***********************************************************************************************/
function cargarBD() {
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
            { keyPath : 'id', autoIncrement : false });
        //materiales.createIndex('por_material', 'id', { unique : true });
        // Coleccion Mano de Obra
        mdObra = active.createObjectStore("mdobra",
            { keyPath : 'id', autoIncrement : false });
        //mdObra = createIndex('por_mdobra', 'id', { unique : true });
        // Coleccion Presupuesto
        presupuesto = active.createObjectStore("presupuesto",
            { KeyPath : 'id', autoIncrement : false });
        //presupuesto = createIndex('por_presupuesto', 'id', { unique : true });
    };

    dataBase.onsuccess = function (e) {
        alert('Base de datos cargada correctamente');
		// Listo las tablas
		listarMateriales();
		listarPresupuestos();
    };
    dataBase.onerror = function (e)  {
        alert('Error cargando la base de datos');
    };

}
/***********************************************************************************************
*** Insertar material
***********************************************************************************************/
function insertarMaterial() {
	// Recupero la conexion a la base de datos
	var active = dataBase.result;
	// El primer parametro es un array con todas las colecciones que van a usarse, 
	// en este caso solo la coleccion materiales, y el modo de transaccion readonly || readwrite.
	var data = active.transaction(["materiales"], "readwrite");
	// Recupero la coleccion
	var object = data.objectStore("materiales");
	// Preparo para insertar
		// Compruebo el nombre del material
	if (document.querySelector("#mtr").value.length <= 0) {
		alert('Debes introducir un material');
	} else if (document.querySelector("#mtr").value.length >= 25) {
		alert('El material no puede superar los 25 caracteres');
	} else {
		// Compruebo que la cantidad no esta vacia
		if (document.querySelector("#cnt").value.length <= 0) {
			alert('Debes introducir una cantidad');
		} else if (document.querySelector("#cnt").value.length >= 100) {
			alert('La cantidad no puede ser superior a 100');
		} else {
			// Compruebo que el precio no quede vacio
			if (document.querySelector("#prc").value.length <= 0) {
				alert('Debes introducir un precio');
			} else {
				var prc_total = document.querySelector("#prc").value * document.querySelector("#cnt").value
				var request = object.put({
   					material: document.querySelector("#mtr").value,
        			cantidad: document.querySelector("#cnt").value,
        			precio: document.querySelector("#prc").value,
					precio_total: prc_total
    			});
				// Si todo ha ido correcto pongo a cero el contenido de los campos y el valor de la variable
				data.oncomplete = function (e) {
    				document.querySelector("#mtr").value = '';
        			document.querySelector("#cnt").value = '';
        			document.querySelector("#prc").value = '';
					prc_total = null;
        			alert('Objeto agregado correctamente');
					window.location.href = '#materiales';
   				}
			}
		}
	}
	// Controlo si se ha producio un error
	request.onerror = function (e) {
    	alert(request.error.name + '\n\n' + request.error.message);
    };
}
/***********************************************************************************************
*** Crear presupuesto
***********************************************************************************************/
function crearPresupuesto() {
	var nombre = prompt("Introduce un nombre descriptivo para el presupuesto");
	if (nombre.length > 0 || nombre.length <= 25) {
		// Si ha introducido el nombre correctamente comienzo la insercion
		var active = dataBase.result;
		var data = active.transaction(["presupuesto"], "readwrite");
		var object = data.objectStore("presupuesto");
		var request = object.put({ nombre: nombre });
		data.oncomplete = function (e) { alert('Objeto agregado correctamente'); }
		window.location.href = '#materiales';
	} else {
		alert("Debe introducir un nombre para poder continuar");
	}
}
/***********************************************************************************************
*** Listar materiales
***********************************************************************************************/
function listarMateriales() {
	// Igual que al agregar, recuperar conexion y abrir transaccion, pero esta vez en modo lectura
	var active = dataBase.result;
	var data = active.transaction(["materiales"], "readonly");
	var object = data.objectStore("materiales");
	
	var elements = [];
	// Ejecuto el openCursror en onsuccess porque quiero llevar a cabo la acción si 
	// y sólo si se tiene éxito en el recorrido de la coleccion
	object.openCursor().onsuccess = function (e) {
		// Recupero el objeto
		var result = e.target.result;
		// Compruebo que no sea nulo
		if (result === null) {
        	return;
    	}
		// si no es nulo lo agrego al array
    	elements.push();
		result.continue();
    };

	// Listo en la tabla los elementos
	data.oncomplete = function () {
    	var outerHTML = '';
		for (var key in elements) {
			outerHTML += '\n\
        		<tr>\n\
            		<td>' + elements[key].cantidad + '</td>\n\
                	<td>' + elements[key].material + '</td>\n\
					<td>' + elements[key].precio + '</td>\n\
                	<td>' + elements[key].precio_total + '</td>\n\
        		</tr>';
        }

        elements = [];
        document.querySelector("#listaMateriales").innerHTML = outerHTML;
    };
}

/***********************************************************************************************
*** Listar presupuestos
***********************************************************************************************/
function listarPresupuestos() {
	var active = dataBase.result;
	var data = active.transaction(["presupuesto"], "readonly");
	var object = data.objectStore("presupuesto");
	
	var elements = [];
	var outerHTML = '';
	object.openCursor().onsuccess = function (e) {
		// Recupero el objeto
		var result = e.target.result;
		// Compruebo que no sea nulo
		if (result === null) { 
			return; 
		}
		// si no es nulo lo agrego al array
    	//
		if (result) {
			// Muestro la id en el primer campo
			outerHTML += '\n\
        		<tr>\n\
            		<td>' + result.key + '</td>';
			elements.push(result.value);
			// Listo en la tabla con el resto de campos
			for (var key in elements) {
				outerHTML += '\n\
                	<td>' + elements[key].nombre + '</td>';
    		}
			outerHTML += '\n\</tr>';
			elements = [];
			result.continue();
		}
    };

	// Listo en la tabla los elementos, aqui se añaden los campos a mostrar
	data.oncomplete = function () {
        document.querySelector("#listaPresupuestos").innerHTML = outerHTML;
    };
}
