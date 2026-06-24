var campoActual = 0;

var btnGuardar =
document.getElementById("btnGuardarEquipo");

if(btnGuardar){
    btnGuardar.addEventListener("click", guardarEquipo);
}

if(document.getElementById("listaEquipos")){
    setTimeout(mostrarEquipos, 500);
}

var cmbEntrenador =
document.getElementById("cmbEntrenador");

if(cmbEntrenador){

    cmbEntrenador.addEventListener("change", function(){

        if(cmbEntrenador.value == "nuevo"){
            window.location.href = "agregar_entrenador.html";
        }
    });
}

function guardarEquipo(){

    var nombre = document.getElementById("txtNombre").value;
    var imagen = document.getElementById("txtImagen").value;
    var entrenador = document.getElementById("cmbEntrenador").value;

    if(nombre == ""){
        alert("Debe ingresar el nombre del equipo.");
        return;
    }

    if(entrenador == ""){
        alert("Debe seleccionar un entrenador.");
        return;
    }

    if(imagen == ""){
        alert("Debe seleccionar un bando para el equipo.");
        return;
    }

    for(var i = 1; i <= 6; i++){

        if(document.getElementById("txtP" + i).value == ""){
            alert("Debe seleccionar los 6 Pokémon del equipo.");
            return;
        }
    }

    var transaccionConsulta = db.transaction(["equipos"],"readonly");
    var tablaConsulta = transaccionConsulta.objectStore("equipos");
    var consulta = tablaConsulta.openCursor();

    consulta.onsuccess = function(e){

        var cursor = e.target.result;

        if(cursor){

            if(cursor.value.nombre.toLowerCase() == nombre.toLowerCase()){
                alert("Ya existe un equipo con ese nombre.");
                return;
            }

            cursor.continue();

        }else{

            var transaccion = db.transaction(["equipos"],"readwrite");
            var tabla = transaccion.objectStore("equipos");

            var datos = {
                nombre: nombre,
                imagen: imagen,
                entrenador: entrenador,
                pokemon: [
                    document.getElementById("txtP1").value,
                    document.getElementById("txtP2").value,
                    document.getElementById("txtP3").value,
                    document.getElementById("txtP4").value,
                    document.getElementById("txtP5").value,
                    document.getElementById("txtP6").value
                ]
            };

            tabla.add(datos);

            alert("Equipo guardado.");
            limpiarFormulario();
        }
    };
}

function mostrarEquipos(){

    var transaccion =
    db.transaction(["equipos"],"readonly");

    var tabla =
    transaccion.objectStore("equipos");

    var consulta = tabla.openCursor();

    var salida = "";

    consulta.onsuccess = function(e){

        var cursor = e.target.result;

        if(cursor){

            var pokemonHTML = "";
            for(var i = 0; i < cursor.value.pokemon.length; i++){
                pokemonHTML += "<li>" + cursor.value.pokemon[i] + "</li>";
            }

            salida +=
                "<div class='tarjeta-equipo'>" +
                    "<div class='tarjeta-equipo-header'>" +
                        "<h2>" + cursor.value.nombre + "</h2>" +
                        "<span class='tarjeta-equipo-bando'>" + cursor.value.imagen + "</span>" +
                    "</div>" +
                    "<div class='tarjeta-equipo-body'>" +
                        "<p class='tarjeta-equipo-entrenador'>Entrenador: <span>" + cursor.value.entrenador + "</span></p>" +
                        "<ul class='tarjeta-pokemon-lista'>" + pokemonHTML + "</ul>" +
                        "<button class='btn-eliminar-equipo' onclick='eliminarEquipo(" + cursor.value.id + ")'>Eliminar equipo</button>" +
                    "</div>" +
                "</div>";

            cursor.continue();

        }else{

            if(salida == ""){
                salida = "<p>No hay equipos registrados.</p>";
            }

            document.getElementById("listaEquipos").innerHTML = salida;
        }
    };
}

function abrirSelector(numero){

    campoActual = numero;

    document.getElementById("selectorPokemon")
        .classList.remove("oculto");

    cargarPokemonSelector();
}

function cerrarSelector(){

    document.getElementById("selectorPokemon")
        .classList.add("oculto");
}

function cargarPokemonSelector(){

    var remoto = new XMLHttpRequest();

    remoto.open(
        "GET",
        "https://pokeapi.co/api/v2/pokemon?offset=0&limit=151",
        true
    );

    remoto.onreadystatechange = function(){

        if(remoto.readyState == 4){

            if(remoto.status == 200){

                var datos = JSON.parse(remoto.responseText);
                var salida = "";

                for(var i = 0; i < datos.results.length; i++){

                    var nombre = datos.results[i].name;
                    var idPokemon = i + 1;

                    var imagen =
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
                    + idPokemon + ".png";

                    if(pokemonYaSeleccionado(nombre)){

                        salida +=
                        '<div class="tarjeta selector-pokemon pokemon-usado">' +
                            '<img src="' + imagen + '">' +
                            '<p>' + nombre + '</p>' +
                            '<span>Ya seleccionado</span>' +
                        '</div>';

                    }else{

                        salida +=
                        '<div class="tarjeta selector-pokemon" onclick="seleccionarPokemon(\'' +
                        nombre + '\')">' +
                            '<img src="' + imagen + '">' +
                            '<p>' + nombre + '</p>' +
                        '</div>';
                    }
                }

                document.getElementById("listaPokemonSelector").innerHTML = salida;
            }
        }
    };

    remoto.send();
}

function pokemonYaSeleccionado(nombre){

    for(var i = 1; i <= 6; i++){

        var valor = document.getElementById("txtP" + i).value;

        if(valor == nombre){
            return true;
        }
    }

    return false;
}

function seleccionarPokemon(nombre){

    document.getElementById("txtP" + campoActual).value = nombre;

    cerrarSelector();
}

function seleccionarEscudo(elemento, imagen){

    document.getElementById("txtImagen").value = imagen;

    var opciones =
    document.getElementsByClassName("escudo-opcion");

    for(var i = 0; i < opciones.length; i++){
        opciones[i].classList.remove("escudo-seleccionado");
    }

    elemento.classList.add("escudo-seleccionado");
}

function limpiarFormulario(){

    document.getElementById("txtNombre").value = "";
    document.getElementById("txtImagen").value = "";

    document.getElementById("cmbEntrenador").selectedIndex = 0;

    for(var i = 1; i <= 6; i++){
        document.getElementById("txtP" + i).value = "";
    }

    var opciones =
    document.getElementsByClassName("escudo-opcion");

    for(var j = 0; j < opciones.length; j++){
        opciones[j].classList.remove("escudo-seleccionado");
    }
}

function eliminarEquipo(id){

    if(confirm("¿Desea eliminar este equipo?")){

        var transaccion =
        db.transaction(["equipos"], "readwrite");

        var tabla =
        transaccion.objectStore("equipos");

        tabla.delete(id);

        transaccion.oncomplete = function(){
            alert("Equipo eliminado.");
            mostrarEquipos();
        };
    }
}