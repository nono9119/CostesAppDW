// Variables globales
var db;
var shortName = 'CostesAppDB';
var version = '1.0';
var displayName = 'CostesAppDB';
var maxSize = 65535;

function onBodyLoad() {
	// Esta funcion es llamada cuando un error ocurre en la transaccion
	function errorHandler(transaction, error) { alert('Error: ' + error.message + ' code: ' + error.code); }

	// Esta funcion es llamada cuando la transaccion es exitosa
	function successCallBack() { alert("DEBUGGING: success"); }

	function nullHandler(){};

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
 	db = openDatabase(shortName, version, displayName,maxSize);
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
}