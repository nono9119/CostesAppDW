// Variables globales
var db;
var shortName = 'CostesAppDB';
var version = '1.0';
var displayName = 'CostesAppDB';
var maxSize = 65535;
var dataset;
var todosPresupuestos = "SELECT * FROM presupuestos";
function onBodyLoad() {
	// Esta funcion es llamada cuando un error ocurre en la transaccion
	function errorHandler(transaction, error) { alert('Error: ' + error.message + ' code: ' + error.code); }

	// Esta funcion es llamada cuando la transaccion es exitosa
	function successCallBack() { alert("DEBUGGING: success"); }

	function nullHandler() {};

	// Esta alerta es usada para saber que la aplicacion ha sido cargada correctamente
	// Esto peude comentarse una vez la aplicacion funcione correctamente
	alert("DEBUGGING: we are in the onBodyLoad() function");

 	if (!window.openDatabase) {
   		// No todos los moviles y navegadores soportan bases de datos
   		// esta alerta sera mostrada indicando que la aplicacion no funciona correctamente en el dispositivo
   		alert('Databases are not supported in this browser.');
   		return;
 	}
	// Creo o abro la base de datos y preparo la transaccion
 	db = openDatabase(shortName, version, displayName, maxSize);
 	db.transaction(function(tx) {
  		// Descomentar lo siguiente para borrar las tablas cada vez que la aplicacion se lance
  		// tx.executeSql('DROP TABLE materiales',nullHandler,nullHandler);
		// tx.executeSql('DROP TABLE mdobra',nullHandler,nullHandler);
		// tx.executeSql('DROP TABLE presupuestos',nullHandler,nullHandler);

  		// Creo las tablas si no existen
    	tx.executeSql('CREATE TABLE IF NOT EXISTS presupuestos (_id INTEGER PRIMARY KEY, nombre VARCHAR(30), ' +  
			'descripcion VARCHAR(100), total_materiales FLOAT, total_mdobra FLOAT, total_presupuesto FLOAT)', [], nullHandler, errorHandler);
		tx.executeSql('CREATE TABLE IF NOT EXISTS mdobra (_id INTEGER PRIMARY KEY, fecha TEXT, horas FLOAT, ' +
	 		'precio FLOAT, total_dia FLOAT, id_presupuesto INTEGER, ' +
			'FOREIGN KEY(id_presupuesto) REFERENCES presupuestos(_id))', [], nullHandler, errorHandler);
		tx.executeSql('CREATE TABLE IF NOT EXISTS materiales (_id INTEGER PRIMARY KEY, material VARCHAR(25), ' + 
			'cantidad FLOAT, precio FLOAT, total FLOAT, descripcion TEXT, id_presupuesto INTEGER, ' +
			'FOREIGN KEY(id_presupuesto) REFERENCES presupuestos(_id))', [], nullHandler, errorHandler);
 	}, errorHandler, successCallBack);
	
	listarPresupuestos();
}

function crearPresupuesto() {
	if (!window.openDatabase) {
   		alert('Databases are not supported in this browser.');
   		return;
 	}
	
	var nombre = prompt("Introduce un nombre descriptivo para el presupuesto");
	if (nombre.length > 0 || nombre.length <= 25) {
		// Si ha introducido el nombre correctamente comienzo la insercion 
 		db.transaction(function(transaction) {
   			transaction.executeSql('INSERT INTO presupuestos (nombre) VALUES ("' + nombre + '")');
   		});
		window.location.href = '#materiales';
	} else { 
		alert("Debe introducir un nombre para poder continuar"); 
	}
	
	return false;
}


/*
function crearTabla(tabla) {
    var myTableDiv = document.getElementById(tabla);

    var table = document.createElement('table');
    //table.border = '1';
	
    var tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    for (var i = 0; i < 3; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 4; j++) {
            var td = document.createElement('TD');
            td.width = '75';
            td.appendChild(document.createTextNode("Cell " + i + "," + j));
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);
}
*/

function listarPresupuestos() {
	if (!window.openDatabase) {
 		alert('Databases are not supported in this browser.');
 		return;
 	}
	// this line clears out any content in the #lbUsers element on the
	// page so that the next few lines will show updated
	// content and not just keep repeating lines
 	//$('#listaPresupuestos').html(tablaPresupuestos);
	var listaPresupuestos = '';
	alert('bablablala0');
 	db.transaction(function(tx) {
   		transaction.executeSql(todosPresupuestos, [], 
			function(tx, result) {
				alert('bablablala');
				dataset = result.rows;
        		for (var i = 0, row = null; i < result.rows.length; i++) {
          			row = dataset.item(i);
					alert('bablablala2');
					listaPresupuestos += '\n\<tr>\n\<td>' + 
						row["_id"] + '</td>\n\<td>' + 
						row["nombre"] + '</td>\n\</tr>';
						/*
					//crearTabla(row._id, row.nombre);
          			$('#listaPresupuestos').append('\n\<tr>\n\<td>' + 
						row._id + '</td>\n\<td>' + 
						row.nombre + 
						//'</td>\n\<td>' + 
						//row.descripcion + '</td>\n\<td>' + 
						//row.total_materiales + '</td>\n\<td>' +
						//row.total_mdobra + '</td>\n\<td>' +
						//row.total_presupuesto + 
						'</td>\n\</tr>');
						*/
        		}
		}, errorHandler);
		alert('bablablala3');
	}, errorHandler, nullHandler);
	$("#listaPresupuestos").append(listaPresupuestos);
}
/*
function crearTabla(id, nombre) {
	var tablaPresupuestos = $('#listaPresupuestos');
	var abertura = '\n\<tr>\n\<td>';
	var medio = '</td>\n\<td>';
	var cierre = '</td>\n\</tr>';
	tablaPresupuestos.html('');
	tablaPresupuestos.html(tablaPresupuestos.html() + abertura + _id + medio + nombre + cierre);
}*/