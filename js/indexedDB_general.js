// Functions about SESSION

/* Logout */
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