var db;

var solicitud = indexedDB.open("PokedexDB",1);

solicitud.onupgradeneeded = function(e){

    db = e.target.result;

    if(!db.objectStoreNames.contains("entrenadores")){
        db.createObjectStore("entrenadores",
        {keyPath:"id", autoIncrement:true});
    }

    if(!db.objectStoreNames.contains("equipos")){
        db.createObjectStore("equipos",
        {keyPath:"id", autoIncrement:true});
    }
};

solicitud.onsuccess = function(e){
    db = e.target.result;
};

solicitud.onerror = function(){
    alert("Error al abrir IndexedDB");
};