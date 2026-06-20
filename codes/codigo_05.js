
var cmbGeneracion = document.getElementById("cmbGeneracion");
var resultados = document.getElementById("Datos");

var url = "https://pokeapi.co/api/v2/pokemon";
var urlImagenes = "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/";


function cargarGeneracion(){

    var valores = cmbGeneracion.value.split(",");
    var offset = valores[0];
    var limit = valores[1];

    resultados.innerHTML = "<p class='cargando'>Cargando Pokémon...</p>";

   
    var remoto = new XMLHttpRequest();

    remoto.open("GET", url + "?offset=" + offset + "&limit=" + limit, true);

    
    remoto.setRequestHeader("Accept","application/json");

    remoto.onreadystatechange = function (){
        if(remoto.readyState == 4){
            if(remoto.status == 200){
                var resul = JSON.parse(remoto.responseText);
                dibujarTarjetas(resul.results);
            }else{
                resultados.innerHTML = "<p>Error al cargar los datos: " + remoto.status + "</p>";
            }
        }
    };

    remoto.send();
}


function dibujarTarjetas(lista){

    var salida = "";

    for(var i = 0; i < lista.length; i++){

        var nombre = lista[i]["name"];

        
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
    }
    resultados.innerHTML = salida;

  
    var tarjetas = document.getElementsByClassName("tarjeta");
    for(var j = 0; j < tarjetas.length; j++){
        tarjetas[j].addEventListener("click",function(){
            var nombreSel = this.getAttribute("data-nombre");
            mostrarDetalle(nombreSel);
        });
    }
}


if(typeof mostrarDetalle !== "function"){
    function mostrarDetalle(nombrePokemon){
        console.log("Pendiente: falta implementar mostrarDetalle() -> " + nombrePokemon);
    }
}


cmbGeneracion.addEventListener("change", cargarGeneracion);



cargarGeneracion();

function mostrarDetalle(nombrePokemon){

    var remoto = new XMLHttpRequest();
    var urlDetalle = "https://pokeapi.co/api/v2/pokemon/" + nombrePokemon;

    remoto.open("GET", urlDetalle, true);

    remoto.onreadystatechange = function(){

        if(remoto.readyState == 4){

            if(remoto.status == 200){

                var pokemon = JSON.parse(remoto.responseText);

                var numero = pokemon.id.toString().padStart(3,"0");
                var imagen = "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/" + numero + ".png";

                var tipos = "";
                var habilidades = "";
                var movimientos = "";

                for(var i=0; i<pokemon.types.length; i++){
                    tipos += pokemon.types[i].type.name + " ";
                }

                for(var j=0; j<pokemon.abilities.length; j++){
                    habilidades += pokemon.abilities[j].ability.name + " ";
                }

                for(var k=0; k<10 && k<pokemon.moves.length; k++){
                    movimientos += pokemon.moves[k].move.name + " - ";
                }

                var salida = "";

                salida += '<div class="modal-contenido">';
                salida += '<button onclick="cerrarModal()" class="btn-cerrar">X</button>';
                salida += '<h2>' + pokemon.name + '</h2>';
                salida += '<div class="modal-cuerpo">';
                salida += '<div class="modal-img"><img src="' + imagen + '" alt="' + pokemon.name + '"></div>';
                salida += '<div class="modal-info">';
                salida += '<p><b>Pokémon ID:</b> #' + numero + '</p>';
                salida += '<p><b>Weight:</b> ' + (pokemon.weight/10) + ' kgs</p>';
                salida += '<p><b>Height:</b> ' + (pokemon.height/10) + ' mts</p>';
                salida += '<p><b>Types:</b> ' + tipos + '</p>';
                salida += '<p><b>Abilities:</b> ' + habilidades + '</p>';
                salida += '<p><b>Moves:</b> ' + movimientos + '</p>';
                salida += '</div>';
                salida += '</div>';
                salida += '</div>';

                document.getElementById("modalPokemon").innerHTML = salida;
                document.getElementById("modalPokemon").classList.remove("oculto");
            }
        }
    };

    remoto.send();
}

function cerrarModal(){
    document.getElementById("modalPokemon").classList.add("oculto");
}