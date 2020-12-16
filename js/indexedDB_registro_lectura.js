function openDB() {
  console.log("abriendo openDB");
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onsuccess = function (evt) {
    db = this.result;
    console.log("openDB DONE");
    verificar_inicio_sesion_registro_lectura();
  };
  request.onerror = function (evt) {
    console.error("openDB:", evt.target.errorCode);
  };
}
function verificar_inicio_sesion_registro_lectura() {
  const transaction = db.transaction([DB_STORE_NAME_ONE], 'readonly')
  const objectStore = transaction.objectStore(DB_STORE_NAME_ONE)
  const request     = objectStore.openCursor()
  request.onsuccess = function(e){
    if(!e.target.result) { // No inició sesión
      window.location = './index.html'
    } else {
      const data_sesion = e.target.result.value;
      /*if(data_sesion.user_type == 0) {
        window.location = './home.html'
      } else {*/
        $('#sesion_name').text(data_sesion.name);
        $('#sesion_user_type').text(data_sesion.user_type);
        $('.opcion_user_adm').show();
        /*if(data_sesion.user_type == 0) {
          $('.opcion_user_adm').hide();
        }*/
      //}
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