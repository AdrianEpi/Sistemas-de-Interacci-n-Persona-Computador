//Database
	var productos = ["Windows 10", "Grafica", "Disco duro", "Torre", "Pantalla", "Portatil", "Memoria RAM", "Placa Base", "Fuente"];
	var imgGrandes = ["img/productos/1.jpg", "img/productos/2.jpg", "img/productos/3.jpg", "img/productos/4.jpg", "img/productos/5.jpg", "img/productos/6.jpg", "img/productos/7.jpg", "img/productos/8.jpg", "img/productos/9.jpg"];
	var imgPeque = ["img/productos/1m.jpg", "img/productos/2m.jpg", "img/productos/3m.jpg", "img/productos/4m.jpg", "img/productos/5m.jpg", "img/productos/6m.jpg", "img/productos/7m.jpg", "img/productos/8m.jpg", "img/productos/9m.jpg"];
	var precios = [79.25, 369.65, 47.00, 42.20, 124.99, 629.99, 37.15, 66.00, 38.50];
	var stock = [24, 16, 4, 2, 4, 3, 8, 9, 1];
	var IGIC = 0.065;
	var selector;
	
	
	
//Main program	
	window.onload = function()
	{
		//Se cargan los productos dentro del HTML de forna dinamica haciendo uso de los datos de la Database
		var DIVS = document.getElementsByName("DIVS");
		for (i in productos)
			DIVS[i].innerHTML = '<a id="imgG' + i + '" href="' + imgGrandes[i] + '"><img id="imgP' + i + '" class="imagen" src="' + imgPeque[i] + '"></a><div class="etiquetas"><b><span id="pro' + i + '">' + productos[i] + '</span>:&nbsp;<span id="pre' + i + '">' + precios[i] + '€</span></b></div><div class="stock">Hay en stock <span id="uni' + i + '">' + stock[i] + '</span> unidades,<br/>¿Cuantas quiere?: <input class="uniBien" type="number" id="selector' + i + '" name="selector" value="0" size="4" /></div>';
		
		// Visualizar al meter los datos los posibles dias, meses, años
		var fecha = new Date();
		var anio = fecha.getFullYear() - 18;				
		
		for (var i=1;i<=31;i++)
			document.getElementById("fechaNacimientoDia").innerHTML = document.getElementById("fechaNacimientoDia").innerHTML + '<option value="' + i + '">' + i + '</option>';				
		
		for (var i=anio;i>=(anio-100);i--)
			document.getElementById("fechaNacimientoAnio").innerHTML = document.getElementById("fechaNacimientoAnio").innerHTML + '<option value="' + i + '">' + i + '</option>';
		//Botones que llevaran a cabo la ejecucion de determinadas secuencias de codigo JavaScript:
		document.getElementById("botonTotal").onclick = validaLasUnidades;
		document.getElementById("botonDatos").onclick = pideDatos;
		document.getElementById("botonConfirmar").onclick = validaDatosPersonales;
	}


//Funcion para validar el carrito
	function validaLasUnidades(elEvento) 
	{
		var todoBien = true;
		selector = document.getElementsByName("selector");
		for (i in productos)
		{		
			if ( selector[i].value == "" || selector[i].value > stock[i] || selector[i].value < 0 )
			{
				todoBien = false;
				selector[i].className = "uniMal";								
				//Modifica el css para quitar los formularios:
				document.getElementById("todo").className = "todoNo";
				document.getElementById("menu").className = "menuNo";
				document.getElementById("divZonaCompra").className = "divZonaCompraNo";
				document.getElementById("divTotal").className = "divsNo";
				document.getElementById("divDatos").className = "divsNo";				
				//Deshabilita el boton de datos personales:
				document.getElementById("botonDatos").disabled = true;				
				//Con solo un error se para la validacion de unidades:
				return;
			}
			else
			{
				todoBien = true;
				selector[i].className = "uniBien";
			}
		}
		//Si no ha habido ningun error, se calcula el precio de la compra
		if (todoBien)
			calculaPrecio();
	}
	

	
//FUNCION QUE MUSTRA EL CARRO DE LA COMPRA:
	function calculaPrecio(elEvento) 
	{
		//Añade el encabezado de la tabla
		document.getElementById("tablaTotal").innerHTML = '<tr><td class="pro"><b>Producto</b></td><td class="uni"><b>Unidades</b></td><td class="preUni"><b>Precio Unidad</b></td><td class="preTotal"><b>Precio Total</b></td></tr>';
		//Inicializacion de las variables para esta funcion:
		var carroTotal = 0;
		var numProductos = 0;			
		//Muestra el carrito de la compra
		for (i in productos)
		{
			var tablaTotal = document.getElementById("tablaTotal").innerHTML;
			var preTotal = 0;				
			//Cuenta el numero de productos para saber cuanto costara el transporte
			if (selector[i].value != 0)
				numProductos++;
			
			if (selector[i].value != 0)
			{			
				//Modifica el css para hacer hueco a los formularios
				document.getElementById("todo").className = "todoSi";
				document.getElementById("menu").className = "menuSi";
				document.getElementById("divZonaCompra").className = "divZonaCompraSi";
				document.getElementById("divTotal").className = "divsSi";
				document.getElementById("divDatos").className = "divsNo";				
				//Habilita el boton de datos personales
				document.getElementById("botonDatos").disabled = false;				
				//Calcula el totalUnidades y rellena el carro de la compra
				preTotal = precios[i] * selector[i].value;
				carroTotal = carroTotal + preTotal;
				document.getElementById("tablaTotal").innerHTML = tablaTotal + '<tr class="proCarrito"><td>' + productos[i] + '</td><td>' + selector[i].value + '</td><td>' + precios[i] + '</td><td id="preTotal' + i +'" name="preTotal">' + preTotal + '</td></tr>';
			}
		}		
		//Si el precio del carrito es mayor a 100 € el transporte será gratuito
		var precioTransporteAPagar;
		if (carroTotal <= 100)
			precioTransporteAPagar = 25;
		else 
			precioTransporteAPagar = "gratis";
		
		//Se calcula el precio con con el transporte, el IGIC y el total:
		if(precioTransporteAPagar == "gratis")
		{
			var totalIGIC = (carroTotal * IGIC);
			var totalAPagar = carroTotal + totalIGIC;
		}
		else
		{
			var totalIGIC = ((carroTotal + precioTransporteAPagar) * IGIC);
			var totalAPagar = carroTotal + precioTransporteAPagar + totalIGIC;
		}
		
		//Limitar a 2 los decimales a mostrar del IGIC:
		totalIGIC=totalIGIC*100;
		totalIGIC=Math.floor(totalIGIC);
		totalIGIC=totalIGIC/100;
		//Limitar a 2 los decimales a mostrar del TOTAL A PAGAR:
		totalAPagar=totalAPagar*100;
		totalAPagar=Math.floor(totalAPagar);
		totalAPagar=totalAPagar/100;				
		//Se añade a la tabla el TOTAL que suma el carrito:
		tablaTotal = document.getElementById("tablaTotal").innerHTML;
		document.getElementById("tablaTotal").innerHTML = tablaTotal + '<tr><td>&nbsp;</td>&nbsp;<td></td><td class="preUni"><b>Transporte: </b></td><td class="preTotal"><b>' + precioTransporteAPagar + '</b></td></tr>' + '<tr><td>&nbsp;</td>&nbsp;<td></td><td class="preUni"><b>IGIC (' + (IGIC*100) + '%): </b></td><td class="preTotal"><b>' + totalIGIC + '</b></td></tr>' + '<tr><td>&nbsp;</td>&nbsp;<td></td><td class="preUni"><b>Total: </b></td><td class="preTotal" id="totalAPagar"><b>' + totalAPagar + ' €</b></td></tr>';
	}		
	
//FUNCION DE PEDIR DATOS
	function pideDatos(elEvento) 
	{
		document.getElementById("divDatos").className = "divsSi";
		document.getElementById("divTotal").className = "divsNo";
		document.getElementById("botonConfirmar").disabled = false;
	}	

	
//FUNCION DE VALIDACION DE DATOS PERSONALES:
	function validaDatosPersonales(elEvento) 
	{
		var todoBien = true;	
		 //Nombre:
			var tmp_nombre = document.getElementById("nombre").value;
			if( tmp_nombre == null || tmp_nombre.length == 0 || /^\s+$/.test(tmp_nombre) || !isNaN(tmp_nombre)) 
			{
				todoBien=false;
				document.getElementById("nombre").className = "textMal";
			}
			else
				document.getElementById("nombre").className = "textBien";
	
		//DNI:	
			var tmp_dni = document.getElementById("dni").value;
			var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
			if( !(/^\d{8}[A-Z]$/.test(tmp_dni)) ) 
			{
				todoBien=false;
				document.getElementById("dni").className = "textMal";
			}
			else
				document.getElementById("dni").className = "textBien";
			
			if(tmp_dni.charAt(8) != letras[(tmp_dni.substring(0, 8))%23]) 
			{
				todoBien=false;
				document.getElementById("dni").className = "textMal";
			}	
			else
				document.getElementById("dni").className = "textBien";
	
		//Fecha de nacimiento DIA:
			var tmp_dia = document.getElementById("fechaNacimientoDia").selectedIndex;
			if( tmp_dia == null || tmp_dia == 0 ) 
			{
				todoBien=false;
				document.getElementById("fechaNacimientoDia").className = "textMal";
			}
			else
				document.getElementById("fechaNacimientoDia").className = "textBien";

		//Fecha de nacimiento MES:
			var tmp_mes = document.getElementById("fechaNacimientoMes").selectedIndex;
			if( tmp_mes == null || tmp_mes == 0 ) 
			{
				todoBien=false;
				document.getElementById("fechaNacimientoMes").className = "textMal";
			}
			else
				document.getElementById("fechaNacimientoMes").className = "textBien";
		
		//Fecha de nacimiento AÑO:
			var tmp_anio = document.getElementById("fechaNacimientoAnio").selectedIndex;
			if( tmp_anio == null || tmp_anio == 0 ) 
			{
				todoBien=false;
				document.getElementById("fechaNacimientoAnio").className = "textMal";
			}
			else
				document.getElementById("fechaNacimientoAnio").className = "textBien";	
	
		//Telefono:
			var tmp_tel = document.getElementById("movil").value;
			if( !(/^\d{9}$/.test(tmp_tel))  ) 
			{
				todoBien=false;
				document.getElementById("movil").className = "textMal";
			}
			else
				document.getElementById("movil").className = "textBien";
	
		//email:
			var tmp_correo1 = document.getElementById("email1").value;
			var tmp_correo2 = document.getElementById("email2").value;
			//email 1
			if( !(/^\w+([-.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(tmp_correo1)) )
			{
				todoBien=false;
				document.getElementById("email1").className = "textMal";
			}
			else
				document.getElementById("email1").className = "textBien";
			
			//email 2
			if( !(/^\w+([-.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(tmp_correo2)) ) 
			{
				todoBien=false;
				document.getElementById("email2").className = "textMal";
			}
			else
				document.getElementById("email2").className = "textBien";

			//Comparacion email 1 y 2
			if (tmp_correo1 != tmp_correo2)
			{
				todoBien=false;
				document.getElementById("email2").className = "textMal";
			}
	
		//Isla:
			var tmp_isla = document.getElementById("Isla").selectedIndex;
			if( tmp_isla == null || tmp_isla == 0 ) 
			{
				todoBien=false;
				document.getElementById("Isla").className = "textMal";
			}
			else
				document.getElementById("Isla").className = "textBien";
	
		//Si no ha habido ni un solo error, se ejecuta la siguiente funcion que se encarga de mostrar el formulario de los datos personales:
		if (todoBien)
			validaDatosPagoYEnviaCarro();
	}


//FUNCION DE VALIDAR DATOS PAGO y ENVIAR DATOS
	function validaDatosPagoYEnviaCarro(elEvento) 
	{
		alert("Gracias por su compra, en 24 horas recibira su pedido\nAhora se le redirigira a la pagina de inicio.");
		window.location.reload()
	}
