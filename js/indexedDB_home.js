const DB_NAME             = 'erp_app_db';
const DB_VERSION          = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME_ONE   = 'data_sesion';
const DB_STORE_NAME_TWO   = 'data_abonado';
const DB_STORE_NAME_THREE = 'data_circuito';
const DB_STORE_NAME_FOUR  = 'data_zona';
const DB_STORE_NAME_FIVE  = 'data_calle';
const DB_STORE_NAME_SIX   = 'data_lectura';

var db;

// Used to keep track of which view is displayed to avoid uselessly reloading it
var current_view_pub_key; // ?

function openDB() {
  console.log("abriendo openDB");
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onsuccess = function (evt) {
    // Better use "this" than "req" to get the result to avoid problems with
    // garbage collection.
    // db = req.result;
    db = this.result;
    console.log("openDB DONE");
    verificar_inicio_sesion();
  };
  request.onerror = function (evt) {
    console.error("openDB:", evt.target.errorCode);
  };
}


function verificar_inicio_sesion() {
  const transaction = db.transaction([DB_STORE_NAME_ONE], 'readonly')
  const objectStore = transaction.objectStore(DB_STORE_NAME_ONE)
  const request     = objectStore.openCursor()
  request.onsuccess = function(e){
    if(!e.target.result) { // No inició sesión
      console.log('No inició sesión')
      window.location = './index.html'
    } else {
      const data_sesion = e.target.result.value;
      $('#sesion_name').text(data_sesion.name);
      console.log(data_sesion)
    }
  }
}
openDB();

function eliminar_data_sesion(){
  console.log('eliminando data sesion')
  const transaction = db.transaction([DB_STORE_NAME_ONE], 'readonly')
  const objectStore = transaction.objectStore(DB_STORE_NAME_ONE)
  const request     = objectStore.openCursor()
  request.onsuccess = function(e){
    if(e.target.result) { // hay dato
      const key         = e.target.result.value.id;
      const transaction = db.transaction([DB_STORE_NAME_ONE], 'readwrite')
      const objectStore = transaction.objectStore(DB_STORE_NAME_ONE)
      const request     = objectStore.delete(key);

      request.onsuccess = function (evt) {
        console.log("Se eliminó successful");
        window.location = './index.html';
      };
      request.onerror = function() {
        console.error("delete error", this.error);
      };
    } else {
      window.location = './index.html';
    }
  }
}