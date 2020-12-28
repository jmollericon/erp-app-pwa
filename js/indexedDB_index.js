function openDB() {
  console.log("abriendo openDB");
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onsuccess = function (evt) {
    db = this.result;
    console.log("openDB DONE");
    verificar_inicio_sesion_index();
  };
  request.onerror = function (evt) {
    console.error("openDB:", evt.target.errorCode);
  };

  request.onupgradeneeded = function (evt) {
    console.log("openDB.onupgradeneeded");
    // STORE ONE - data_sesion
    var store_one = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_ONE, { keyPath: 'id', autoIncrement: true });
    store_one.createIndex('username', 'username', { unique: true });
    store_one.createIndex('name', 'name', { unique: false });
    store_one.createIndex('user_type', 'user_type', { unique: false });
    store_one.createIndex('page', 'page', { unique: false });
    // STORE TWO - data_abonado
    /*var store_two = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_TWO, { keyPath: 'id', autoIncrement: true });
    store_two.createIndex('biblioid', 'biblioid', { unique: true });
    store_two.createIndex('title', 'title', { unique: false });
    store_two.createIndex('year', 'year', { unique: false });*/

    // STORE THREE - data_circuito
    var store_three = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_THREE, { keyPath: 'Id_Circuito' });
    store_three.createIndex('Id_Circuito', 'Id_Circuito', { unique: true });
    store_three.createIndex('Sigla', 'Sigla', { unique: false });
    store_three.createIndex('Circuito', 'Circuito', { unique: false });
    // STORE FOUR - data_zona
    var store_four = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_FOUR, { keyPath: 'Id_Zona' });
    store_four.createIndex('Id_Zona', 'Id_Zona', { unique: true });
    store_four.createIndex('Localidad', 'Localidad', { unique: false });
    store_four.createIndex('Sigla', 'Sigla', { unique: false });
    store_four.createIndex('Zona', 'Zona', { unique: false });
    // STORE FIVE - data_calle
    var store_five = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_FIVE, { keyPath: 'Id_Calle' });
    store_five.createIndex('Id_Calle', 'Id_Calle', { unique: true });
    store_five.createIndex('Circuito', 'Circuito', { unique: false });
    store_five.createIndex('Zona', 'Zona', { unique: false });
    store_five.createIndex('Sigla', 'Sigla', { unique: false });
    store_five.createIndex('Calle', 'Calle', { unique: false });
    // STORE SIX - data_lectura
    var store_six = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_SIX, { keyPath: 'mes' });
    store_six.createIndex('mes', 'mes', { unique: true });
    store_six.createIndex('mes_literal', 'mes_literal', { unique: false });
    store_six.createIndex('username', 'username', { unique: false });
    store_six.createIndex('cantidad_registros', 'cantidad_registros', { unique: false });
    store_six.createIndex('fecha_registros', 'fecha_registros', { unique: false });
    store_six.createIndex('estado', 'estado', { unique: false });
    store_six.createIndex('created_at', 'created_at', { unique: false });

    // STORE SEVEN - data_lectura_registro
    var store_seven = evt.currentTarget.result.createObjectStore(DB_STORE_NAME_SEVEN, { keyPath: 'id' });
    store_seven.createIndex('id', 'id', { unique: true });
    store_seven.createIndex('data1', 'data1', { unique: false });
    store_seven.createIndex('data2', 'data2', { unique: false });
    store_seven.createIndex('data3', 'data3', { unique: false });
    store_seven.createIndex('lectura', 'lectura', { unique: false });
  };
}
function add_data_sesion(username, name, user_type, page) {
  const data_sesion = { username, name, user_type, page };
  const transaction = db.transaction([DB_STORE_NAME_ONE], 'readwrite')
  const objectStore = transaction.objectStore(DB_STORE_NAME_ONE)
  const request = objectStore.add(data_sesion)
  request.onsuccess = function (evt) {
    console.log("Insertion in DB successful");
    //displayActionSuccess();
    //displayPubList(store);
  };
  request.onerror = function() {
    console.error("addPublication error", this.error);
    //displayActionFailure(this.error);
  };
}
function verificar_inicio_sesion_index() {
  const transaction = db.transaction([DB_STORE_NAME_ONE], 'readonly')
  const objectStore = transaction.objectStore(DB_STORE_NAME_ONE)
  const request     = objectStore.openCursor()
  request.onsuccess = function(e){
    if(e.target.result) { // Inició sesión
      const data_sesion = e.target.result.value;
      console.log(data_sesion)
      if(data_sesion.page == 'home')
        window.location = './home.html';
    }
  }
}
openDB();