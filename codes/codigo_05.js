var cmbGeneracion = document.getElementById("cmbGeneracion");
var resultados = document.getElementById("Datos");

var url = "https://pokeapi.co/api/v2/pokemon";

function cargarGeneracion(){

    var valores = cmbGeneracion.value.split(",");
    var offset = valores[0];
    var limit = valores[1];

    resultados.innerHTML = "<p class='cargando'>Cargando Pokémon...</p>";

    var remoto = new XMLHttpRequest();

    remoto.open("GET", url + "?offset=" + offset + "&limit=" + limit, true);
    remoto.setRequestHeader("Accept","application/json");

    remoto.onreadystatechange = function(){

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

    var imagen =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
        + idPokemon + ".png";

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

        tarjetas[j].addEventListener("click", function(){

            var nombreSel = this.getAttribute("data-nombre");
            mostrarDetalle(nombreSel);
        });
    }
}

function mostrarDetalle(nombrePokemon){

    var remoto = new XMLHttpRequest();
    var urlDetalle = "https://pokeapi.co/api/v2/pokemon/" + nombrePokemon;

    remoto.open("GET", urlDetalle, true);
    remoto.setRequestHeader("Accept","application/json");

    remoto.onreadystatechange = function(){

        if(remoto.readyState == 4){

            if(remoto.status == 200){

                var pokemon = JSON.parse(remoto.responseText);

                var numero = pokemon.id.toString().padStart(3,"0");

                var imagen = "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/"
                           + numero + ".png";

                var tipos = "";
                var habilidades = "";
                var movimientos = "";

                for(var i = 0; i < pokemon.types.length; i++){
                    tipos = tipos.concat(pokemon.types[i].type.name);

                    if(i < pokemon.types.length - 1){
                        tipos = tipos.concat(" - ");
                    }
                }

                for(var j = 0; j < pokemon.abilities.length; j++){
                    habilidades = habilidades.concat(pokemon.abilities[j].ability.name);

                    if(j < pokemon.abilities.length - 1){
                        habilidades = habilidades.concat(" - ");
                    }
                }

                for(var k = 0; k < 10 && k < pokemon.moves.length; k++){
                    movimientos = movimientos.concat(pokemon.moves[k].move.name);

                    if(k < 9 && k < pokemon.moves.length - 1){
                        movimientos = movimientos.concat(" - ");
                    }
                }

                var salida = "";

                salida = salida.concat('<div class="modal-contenido">');
                salida = salida.concat('<button onclick="cerrarModal()" class="btn-cerrar">X</button>');

                salida = salida.concat('<h2>' + pokemon.name + '</h2>');

                salida = salida.concat('<div class="modal-cuerpo">');

                salida = salida.concat('<div class="modal-img">');
                salida = salida.concat('<img src="' + imagen + '" alt="' + pokemon.name + '">');
                salida = salida.concat('</div>');

                salida = salida.concat('<div class="modal-info">');
                salida = salida.concat('<p><b>Pokémon ID:</b> #' + numero + '</p>');
                salida = salida.concat('<p><b>Weight:</b> ' + (pokemon.weight / 10) + ' kgs</p>');
                salida = salida.concat('<p><b>Height:</b> ' + (pokemon.height / 10) + ' mts</p>');
                salida = salida.concat('<p><b>Types:</b> ' + tipos + '</p>');
                salida = salida.concat('<p><b>Abilities:</b> ' + habilidades + '</p>');
                salida = salida.concat('<p><b>Moves:</b> ' + movimientos + '</p>');
                salida = salida.concat('</div>');

                salida = salida.concat('</div>');
                salida = salida.concat('</div>');

                document.getElementById("modalPokemon").innerHTML = salida;
                document.getElementById("modalPokemon").classList.remove("oculto");

            }else{

                document.getElementById("modalPokemon").innerHTML =
                    '<div class="modal-contenido">' +
                    '<button onclick="cerrarModal()" class="btn-cerrar">X</button>' +
                    '<p>Error al cargar el detalle del Pokémon.</p>' +
                    '</div>';

                document.getElementById("modalPokemon").classList.remove("oculto");
            }
        }
    };

    remoto.send();
}

function cerrarModal(){

    document.getElementById("modalPokemon").classList.add("oculto");
}

cmbGeneracion.addEventListener("change", cargarGeneracion);

cargarGeneracion();