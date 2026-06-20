/*jshint sub:true*/

// Declaración de variables locales
// relacionadas con interface html
var cmbGeneracion = document.getElementById("cmbGeneracion");
var resultados = document.getElementById("Datos");

// Declara las variables para conectarse con el servicio remoto
// que contiene la informacion de los Pokemon (PokeAPI)
//--------------------------------------------------------------
var url = "https://pokeapi.co/api/v2/pokemon";
var urlImagenes = "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/";

//--------------------------------------------------------------
// Función que carga el Pokédex según la generación seleccionada
// en el combo cmbGeneracion (offset y limit van en el "value"
// de cada <option>, ej: "151,100")
//--------------------------------------------------------------
function cargarGeneracion(){

    var valores = cmbGeneracion.value.split(",");
    var offset = valores[0];
    var limit = valores[1];

    resultados.innerHTML = "<p class='cargando'>Cargando Pokémon...</p>";

    //Determina la funcion HTTPRequest entre sitio local y el remoto
    var remoto = new XMLHttpRequest();

    remoto.open("GET", url + "?offset=" + offset + "&limit=" + limit, true);

    //Determina la forma de intercambio de datos entre el sitio local
    //y el sitio remoto para la pagina actual
    remoto.setRequestHeader("Accept","application/json");

    remoto.onreadystatechange = function (){
        if(remoto.readyState == 4){
            if(remoto.status == 200){
                var resul = JSON.parse(remoto.responseText);
                dibujarTarjetas(resul.results);
            }else{
                resultados.innerHTML = "<p>Error al cargar los datos: " + remoto.status + "</p>";
            }
        }//fin del if de readyState
    };//fin de la funcion interna

    remoto.send();
}

//--------------------------------------------------------------
// Dibuja una tarjeta (imagen + nombre) por cada Pokémon recibido
// y le asigna el evento click para pedir el detalle
//--------------------------------------------------------------
function dibujarTarjetas(lista){

    var salida = "";

    for(var i = 0; i < lista.length; i++){

        var nombre = lista[i]["name"];

        // El "url" de cada Pokemon trae su numero al final,
        // ej: https://pokeapi.co/api/v2/pokemon/6/
        var partes = lista[i]["url"].split("/");
        var idPokemon = partes[partes.length - 2];
        var idFormato = ("000" + idPokemon).slice(-3);
        var imagen = urlImagenes + idFormato + ".png";

        salida = salida.concat(
            '<div class="tarjeta" data-nombre="' + nombre + '">' +
                '<img src="' + imagen + '" alt="' + nombre + '">' +
                '<p>' + nombre + '</p>' +
            '</div>'
        );
    }//fin del for

    resultados.innerHTML = salida;

    // Asigna el evento click a cada tarjeta recien generada
    var tarjetas = document.getElementsByClassName("tarjeta");
    for(var j = 0; j < tarjetas.length; j++){
        tarjetas[j].addEventListener("click",function(){
            var nombreSel = this.getAttribute("data-nombre");
            mostrarDetalle(nombreSel);
        });
    }
}

//--------------------------------------------------------------
// IMPORTANTE: mostrarDetalle(nombrePokemon) y cerrarModal() las
// hace mi compañera (Persona 2). Dejo este "stub" temporal SOLO
// para poder probar mi parte sin que el código truene mientras
// ella termina su función real; cuando ella agregue su función
// en este mismo archivo, esta de abajo debe eliminarse.
//--------------------------------------------------------------
if(typeof mostrarDetalle !== "function"){
    function mostrarDetalle(nombrePokemon){
        console.log("Pendiente: falta implementar mostrarDetalle() -> " + nombrePokemon);
    }
}

//--------------------------------------------------------------
// Programación de eventos
//--------------------------------------------------------------
cmbGeneracion.addEventListener("change", cargarGeneracion);


//--------------------------------------------------------------
cargarGeneracion();