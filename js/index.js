//  Función estándar que me permite recibir la url del servidor, los datos que mando y la función que
//retornara si se ha hecho bien la consulta. En la función que retorna lleva implícita la respuesta. 
$.support.cors = true;
$.ajaxSetup({
	error: function(jqXHR, exception) {
	   if (jqXHR.status === 0) {
		   alert('No hay conexión: Verificar red.: 0');
	   } else if (jqXHR.status == 404) {
		   alert('la URL especificada para la solicitud ajax no se encontró: [404]');
	   } else if (jqXHR.status == 500) {
		   alert('Error interno del servidor: [500].');
	   } else if (exception === 'parsererror') {
		   alert('Fallo la respuesta JSON: parseerror.');
	   } else if (exception === 'timeout') {
		   alert('Se paso el tiempo de espera: timeout.');
	   } else if (exception === 'abort') {
		   alert('Respuesta de Ajax abortado: abort');
	   } else {
		   alert('Error no detectado: ' + jqXHR.responseText);
	   }
	}
}); 
// Esta función nos sirve para hacer todas las llamadas AJAX de tipo GET y con dataType = json
// Los parámetros son la url, los datos que se envian y la función que se ejecutará si el proceso se ha realizado bien
// "funcionretorno" es un puntero que apunta a la función que llama por ejemplo "mostrarDatos"

function obtenerDatosJSON(url, datos, funcionretorno){ 
	$.ajax({
		data: datos,
		url: url,
		type: 'GET',
		dataType: "json",
		async: false,
		success: funcionretorno    
	}).error(function(jqXHR) {
		alert('ERROR mio' + jqXHR.status + ' ' + jqXHR.statusText);
	});  //  ssasdfsadfsd fsa 
}
//  sdfsfasf
//   Inicio cuando se ha cargado el DOM usando jQUERY 
$(document).ready(function(){ 
	$("#indicador").html("<img src='img/ajax-loader.gif'/>");
	$("#idAltaCentro").on("click", function (e) {
        $(".Si").removeAttr("disabled");
        $("#dialogoEditar").dialog({
            title: 'Alta de centro',
            autoOpen: false,
            resizable: false,
            height: 400,
            width: 600,
            show: { effect: 'drop', direction: "up" },
            draggable: true,
            modal: true,                     
            open: function (event, ui) {
                idcentro.value = "";
                idnombrecentro.value = "";
                idlocalidad.value = "";
                idprovincia.value = "";
            },
            buttons: {
                "Aceptar": function () {
                    altaCentro();      
                    $(this).dialog("close");
                },
                "Cerrar": function () {
                    $(this).dialog("close");
                }
            }
        });
        $("#dialogoEditar").dialog('open');
        return false;
    });  // final $("#altaUsuario").on("click"
	mostrarDatosCentros();
});
// df gdfg
//  Función que se llama cada vez que queremos consultar todos los datos del centro
//   sdfs sd sdfasdf
// dfasdfsaf
function mostrarDatosCentros(){
	var url = 'datosjson.php';
	var MisDatos = 'Esto es una prueba';
	var datosVan = {'accion' : 'recursosCentro'};
	obtenerDatosJSON(url, datosVan, mostrarDatos);
}

//  Función que se llama desde la anterior para mostrar los datos.
function mostrarDatos(resultados){
	texto  =  "<table  border=1><tr><th>id centro</th><th>Nombre Centro</th><th>Localidad</th><th>Provincia</th><th>Telefono</th><th>Fecha Visita</th><th>Numero Visitantes</th></tr>";
	//  Hacemos  un  bucle  para  recorrer  todos  los  objetos  literales  recibidos  en  el  array 
	//  resultados y mostrar su contenido.
	for (var i=0; i < resultados.length; i++){
		objeto = resultados[i];
		texto+="<tr><td>"+objeto.id+"</td><td>"+objeto.nombrecentro+"</td><td>"+
		objeto.localidad+"</td><td>"+objeto.provincia+"</td><td>"+
		objeto.telefono+"</td><td>"+objeto.fechavisita+"</td><td>"+
		objeto.numvisitantes+"</td>";
		texto+="<td><input type='button' value='Borrar' onClick='borrarCentro("+ objeto.id +")';'></td>";
		texto+="<td><input type='button' value='Mostrar datos' onClick='mostrarCentro(" + objeto.id + ")';'></td>";
		texto+="</tr>";
	}
	// Desactivamos el indicador AJAX cuando termina la petición
//	document.getElementById("indicador").innerHTML="";
	// Imprimimos la tabla dentro del contenedor resultados.
	document.getElementById("resultados").innerHTML=texto;
} 

//  Damos de alta un registro
function altaCentro(){
	if(confirm("¿Seguro que deseas dar un alta")){
		var url = 'datosjson.php';
		var datosVan = '{"accion":"nueva","nombrecentro":"' + idnombrecentro.value + '","localidad":"' + idlocalidad.value + '","provincia":"' + idprovincia.value + '"}';
//		alert("Datos que van = " + datosVan);
		var json = $.parseJSON(datosVan);
//		alert("Datos que van = " + json);
//		obtenerDatosJSON(url, json, mostrarDatosCentros);
		obtenerDatosJSON(url, json, function(resultados){
					alert("resultado del alta = " + resultados);
					mostrarDatosCentros();

		});
	}
}

function borrarCentro(indice){
	if(confirm("¿Seguro que desea borrar el registro de "+indice,"titulo")){
		var url = 'datosjson.php';
		var datosVan = '{"accion":"borrar","id":"' + indice + '"}';
		var json = $.parseJSON(datosVan);
		obtenerDatosJSON(url, json,function(resultados){
					alert("resultado de la baja = " + resultados.resultado);
					mostrarDatosCentros();
		});  
	}
}

function mostrarCentro(indice){
//	alert("id centro = "+ indice);
	var objeto = null;
	var url = 'datosjson.php';
	var datosVan = '{"accion":"consultaid","id":"' + indice + '"}';
	var json = $.parseJSON(datosVan);
	obtenerDatosJSON(url, json,function(resultados){
		parent.objeto = resultados;
	});  
    $(".Si").removeAttr("disabled");
    $("#dialogoEditar").dialog({
        title: 'Consulta de centro',
        autoOpen: false,
        resizable: false,
        height: 400,
        width: 600,
        show: { effect: 'drop', direction: "up" },
        draggable: true,
        modal: true,                     
        open: function (event, ui) {
            idcentro.value = parent.objeto[0].id;
            idnombrecentro.value = parent.objeto[0].nombrecentro;
            idlocalidad.value = parent.objeto[0].localidad;
            idprovincia.value = parent.objeto[0].provincia;
        },
        buttons: {
            "Aceptar": function () {     
                $(this).dialog("close");
            },
            "Cerrar": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#dialogoEditar").dialog('open');	
} 