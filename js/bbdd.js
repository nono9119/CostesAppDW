// Creo o abro la base de datos
var db = window.openDatabase("CostesApp", "1.0", "Base de datos de la App", 1024 * 1024);
var ItemId = 0;

function CreaDB() { db.transaction(CrearTablas, errorCB, successCB); }

function CrearTablas(tx) {
	// Preparo las tablas
	var tablaPresupuesto = 'CREATE TABLE IF NOT EXISTS presupuestos (_id INTEGER PRIMARY KEY, nombre VARCHAR(30), ' +  
		'descripcion VARCHAR(100), total_material FLOAT, total_mdobra FLOAT);';
	var tablaMdObra = 'CREATE TABLE IF NOT EXISTS mdobra (_id INTEGER PRIMARY KEY, fecha TEXT, horas FLOAT, ' +
	 	'precio FLOAT, total FLOAT, id_presupuesto INTEGER, ' +
		'FOREIGN KEY(id_presupuesto) REFERENCES presupuestos(_id));';
	var tablaMateriales = 'CREATE TABLE IF NOT EXISTS materiales (_id INTEGER PRIMARY KEY, material VARCHAR(25), ' + 
		'cantidad FLOAT, precio FLOAT, total FLOAT, id_presupuesto INTEGER, ' +
		'FOREIGN KEY(id_presupuesto) REFERENCES presupuestos(_id));';
	// Ejecuto las sentencias
    tx.executeSql(tablaPresupuesto);
	tx.executeSql(tablaMdObra);
	tx.executeSql(tablaMateriales);
}

function errorCB(err) {
    // Esto se puede ir a un Log de Error diría el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show <span class="wp-smiley wp-emoji wp-emoji-tongue" title=":P">:P</span>
    alert("Error processing SQL: Codigo: " + err.code + " Mensaje: " + err.message);
}
