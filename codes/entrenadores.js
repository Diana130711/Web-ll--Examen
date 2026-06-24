var btnGuardarEntrenador =
document.getElementById("btnGuardarEntrenador");

if(btnGuardarEntrenador){
    btnGuardarEntrenador.addEventListener("click", guardarEntrenador);
}

var txtFoto = document.getElementById("txtFoto");
var imgVistaPrevia = document.getElementById("imgVistaPrevia");

if(txtFoto && imgVistaPrevia){

    txtFoto.addEventListener("input", function(){

        if(txtFoto.value.trim() == ""){
            imgVistaPrevia.classList.add("oculto");
        }else{
            imgVistaPrevia.src = txtFoto.value;
            imgVistaPrevia.classList.remove("oculto");
        }
    });
}


if(document.getElementById("listaEntrenadores")){
    setTimeout(mostrarEntrenadores, 500);
}


function guardarEntrenador(){

    var nombre = document.getElementById("txtNombre").value.trim();
    var sexo = document.getElementById("cmbSexo").value;
    var residencia = document.getElementById("txtResidencia").value.trim();
    var foto = document.getElementById("txtFoto").value.trim();

    if(nombre == ""){
        alert("Debe ingresar el nombre y apellidos del entrenador.");
        return;
    }

    if(residencia == ""){
        alert("Debe ingresar el lugar de residencia.");
        return;
    }

    var transaccion = db.transaction(["entrenadores"],"readwrite");
    var tabla = transaccion.objectStore("entrenadores");

    var datos = {
        nombre: nombre,
        sexo: sexo,
        residencia: residencia,
        foto: foto
    };

    tabla.add(datos);

    transaccion.oncomplete = function(){
        alert("Entrenador guardado.");
        window.location.href = "entrenadores.html";
    };
}


function mostrarEntrenadores(){

    var transaccion = db.transaction(["entrenadores"],"readonly");
    var tabla = transaccion.objectStore("entrenadores");
    var consulta = tabla.openCursor();

    var salida = "";

    consulta.onsuccess = function(e){

        var cursor = e.target.result;

        if(cursor){

            var foto = cursor.value.foto;

            if(!foto){
                foto = "https://via.placeholder.com/150?text=Sin+foto";
            }

            salida = salida.concat(
                '<div class="tarjeta-entrenador">' +
                    '<img src="' + foto + '" alt="' + cursor.value.nombre + '">' +
                    '<h3>' + cursor.value.nombre + '</h3>' +
                    '<p><strong>Sexo:</strong> ' + cursor.value.sexo + '</p>' +
                    '<p><strong>Residencia:</strong> ' + cursor.value.residencia + '</p>' +
                '</div>'
            );

            cursor.continue();

        }else{

            if(salida == ""){
                salida = "<p>No hay entrenadores registrados.</p>";
            }

            document.getElementById("listaEntrenadores").innerHTML = salida;
        }
    };
}