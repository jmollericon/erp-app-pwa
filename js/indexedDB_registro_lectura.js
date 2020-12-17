function openDB() {
  console.log("abriendo openDB");
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onsuccess = function (evt) {
    db = this.result;
    console.log("openDB DONE");
    verificar_inicio_sesion_registro_lectura();
    renderizar_lecturas_desde_indexedDB();
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


// Leer Lectura desde IndexedDB
function renderizar_lecturas_desde_indexedDB() {
  let data_lecturas  = [];
  const transaction   = db.transaction([DB_STORE_NAME_SIX], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_SIX);
  const request       = objectStore.openCursor();
  request.onsuccess = function (e) {
    const cursor    = e.target.result;
    if(cursor) {
      data_lecturas.push(cursor.value)
      cursor.continue();
    } else {
      data_lecturas = data_lecturas.reverse();
      const lecturas_html = data_lecturas.map((l) => {
        return `
          <li onclick="registrar_lectura_mes('${l.mes}')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fa fa-calendar-check-o"></i>&nbsp; ${l.mes_literal}</span>
            <span class="badge badge-primary badge-pill">14</span>
          </li>`;
      }).join('');
      $('#lista_lecturas').empty().append(lecturas_html);
    }
  };
  request.onerror = function() {
    time_alert('error', '', 'Error en la lectura de datos.', 2000)
  };
}
// Registrar Lectura (mes)
function registrar_mes_indexedDB(mes, mes_literal) {
  const transaction = db.transaction([DB_STORE_NAME_ONE], 'readonly')
  const objectStore = transaction.objectStore(DB_STORE_NAME_ONE)
  const request     = objectStore.openCursor()
  request.onsuccess = function(e){
    if(e.target.result) { // Inició sesión
      const data_sesion = e.target.result.value;
      console.log(data_sesion)
      if(data_sesion.user_type == 0) {
        window.location = './index.html';
      } else {
        const username      = data_sesion.username;
        const hoy           = new Date();
        const created_at    = hoy.getFullYear()+'-'+(hoy.getMonth()+1)+'-'+hoy.getDate()+' '+hoy.getHours()+':'+hoy.getMinutes()+':'+hoy.getSeconds();
        const data_lectura  = { mes, mes_literal, username, created_at };
        const transaction = db.transaction([DB_STORE_NAME_SIX], 'readwrite')
        const objectStore = transaction.objectStore(DB_STORE_NAME_SIX)
        const request = objectStore.add(data_lectura)
        request.onsuccess = function (evt) {
          renderizar_lecturas_desde_indexedDB();
          time_alert('success', '', 'Registrado!.', 2000)
          .then(() => {
            $('#modal_nuevo_registro').modal('hide');
          });
        };
        request.onerror = function() {
          console.log("data lectura error", this.error);
          time_alert('error', '', 'Mes ya registrado.', 2000)
        };
      }
    } else {
      window.location = './index.html';
    }
  }
}