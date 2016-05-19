<?php
/*
	Esta página realiza las siguientes acciones según los parámetros recibidos:
	
	Parámetros:	accion=nueva&nombrecentro=xxxxx&localidad=xxxxx
	Acción:		Insertará la url xxxxx en la tabla MySQL de centro.
	Salida:		Imprimirá el ID del último recurso añadido.
	Formato:	JSON

	Parámetros:	accion=borrar&id=xx
	Acción:		Borrará la url con id x de la tabla de centro.
	Salida:		Imprimirá mensaje de OK.
	Formato:	JSON
	
	Parámetros:	accion=consultaid&id=xx
	Acción:		Se conecta a la URL indicada por el ID y descarga el RSS de Internet.
	Salida:		El fichero XML del centro en formato JSON.
	Formato: 	JSON

	Parámetros:	accion=recursosCentro
	Acción:		Devuelve todos los datos de la tabla rss.
	Salida:		Un array con los campos id, titulo, url en formato JSON.
	Formato: 	JSON	
	
	Parámetros:	accion=numCentros
	Acción:		Devuelve el número total de RSS que tenemos en la tabla.
	Salida:		Un número indicando los RSS que hay en la tabla.
	Formato: 	texto
*/
// Cabecera para indicar que vamos a enviar datos JSON y que no haga caché de los datos.
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
/* 
Utilizar el fichero ajax.sql incluído en la carpeta para crear la base de datos.
Si fuera necesario modifica los datos de la configuración y adáptalos a tu entorno 
de trabajo. 
*/
// Configuración BASE DE DATOS MYSQL
$servidor = "localhost";
$basedatos = "ajax";
$usuario = "ajax";
$password = "dwec";
// Creamos la conexión al servidor.
$conexion=mysql_connect($servidor, $usuario, $password) or die(mysql_error());
mysql_query("SET NAMES 'utf8'",$conexion);
// Seleccionar la base de datos en esa conexion.
mysql_select_db($basedatos,$conexion) or die(mysql_error());
switch($_GET['accion'])
{   
	case 'nueva':
		$sql= sprintf("insert into centros(nombrecentro,localidad,provincia) values('%s','%s','%s')",mysql_real_escape_string($_GET['nombrecentro']),mysql_real_escape_string($_GET['localidad']),mysql_real_escape_string($_GET['provincia']));
		mysql_query($sql,$conexion) or die(mysql_error());
		echo json_encode(mysql_insert_id());
	break;
	
	case 'borrar':
		$sql= sprintf("delete from centros where id=%s",mysql_real_escape_string($_GET['id']));
		mysql_query($sql,$conexion) or die(mysql_error());
		echo '{"resultado":"bien"}';
	break;
	
	case 'consultaid':
		$sql= sprintf("select * from centros where id=%s",mysql_real_escape_string($_GET['id']));
		$resultados=mysql_query($sql,$conexion) or die(mysql_error());
		while ( $fila = mysql_fetch_array($resultados, MYSQL_ASSOC))
		{
			$datos[]=$fila;
		}
		echo json_encode($datos);
	break;

	case 'recursosCentro':
		$sql= sprintf("select * from centros order by nombrecentro");
		$resultados=mysql_query($sql,$conexion) or die(mysql_error());
		while ( $fila = mysql_fetch_array($resultados, MYSQL_ASSOC))
		{
			$datos[]=$fila;
		}
		//   Este codigo se hace para que se puedan hacer peticiones desde páginas 
		//  que no están en el mismo dominio CORS 
		if(isset($_GET['callback'])){ // Si es una petición cross-domain
           echo $_GET['callback'].'('.json_encode($datos).')';
        }
        else // Si es una normal, respondemos de forma normal
        echo json_encode($datos);
	break;
	
	case 'numCentros':	// Devuelve el número total de centros que tenemos en la base de datos.
		$sql= sprintf("select * from centros order by id");
		$resultados=mysql_query($sql,$conexion) or die(mysql_error());
		echo mysql_num_rows($resultados);
	break;
}
mysql_close($conexion);
?>