let Id_Circuito = 0, Id_Zona = 0, Id_Calle = 0, Anio_Mes = '';
function openDB() {
  console.log("abriendo openDB");
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onsuccess = function (evt) {
    db = this.result;
    console.log("openDB DONE");
    verificar_inicio_sesion_lectura_registro();
    obtener_direccion_CZC_desde_indexedDB() /* Circuitos, Zonas y Calles */
    renderizar_lectura_registros_desde_indexedDB_by_CZC();
  };
  request.onerror = function (evt) {
    console.error("openDB:", evt.target.errorCode);
  };
}
function verificar_inicio_sesion_lectura_registro() {
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
// Obtener datos enviados desde lectura.html
const parametros = window.location.search.substr(1).split('+');
Id_Circuito = parametros[0];
Id_Zona     = parametros[1];
Id_Calle    = parametros[2];
Anio_Mes    = parametros[3];

// Leer Lectura desde IndexedDB
function renderizar_lectura_registros_desde_indexedDB_by_CZC() {
  console.log('Renderizar: ', Id_Circuito, Id_Zona, Id_Calle);
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
          <li onclick="registrar_lectura_mes('${l.mes}', '${l.cantidad_registros}', '${l.fecha_registros}')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fa fa-calendar-check-o"></i>&nbsp; ${l.mes_literal}</span>
            <span class="badge badge-primary badge-pill">${l.cantidad_registros}</span>
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
function registrar_mes_indexedDB2(mes, mes_literal, cantidad_registros, fecha_registros) {
  const transaction = db.transaction([DB_STORE_NAME_ONE], 'readonly')
  const objectStore = transaction.objectStore(DB_STORE_NAME_ONE)
  const request     = objectStore.openCursor()
  request.onsuccess = function(e){
    if(e.target.result) { // Inició sesión
      const data_sesion = e.target.result.value;
      console.log(data_sesion)
      /*if(data_sesion.user_type == 0) {
        window.location = './home.html';
      } else {*/
        const username      = data_sesion.username;
        const hoy           = new Date();
        const created_at    = hoy.getFullYear()+'-'+(hoy.getMonth()+1)+'-'+hoy.getDate()+' '+hoy.getHours()+':'+hoy.getMinutes()+':'+hoy.getSeconds();
        const data_lectura  = { mes, mes_literal, username, cantidad_registros, fecha_registros, created_at };
        const transaction = db.transaction([DB_STORE_NAME_SIX], 'readwrite')
        const objectStore = transaction.objectStore(DB_STORE_NAME_SIX)
        const request = objectStore.add(data_lectura)
        request.onsuccess = function (evt) {
          renderizar_lectura_registros_desde_indexedDB_by_CZC();
          time_alert('success', '', 'Registrado!.', 2000)
          .then(() => {
            $('#modal_nuevo_registro').modal('hide');
          });
        };
        request.onerror = function() {
          console.log("data lectura error", this.error);
          time_alert('error', '', 'Mes ya registrado.', 2000)
        };
      /*}*/
    } else {
      window.location = './index.html';
    }
  }
}
// Obtener Circuito, Zona y Calle
function get_circuito_by_id_desde_indexedDB() {
  const transaction   = db.transaction([DB_STORE_NAME_THREE], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_THREE);
  const request       = objectStore.get(Id_Circuito);
  request.onsuccess = function (e) {
    $('#circuito_nombre').text(request.result.Circuito);
  };
  request.onerror = function() {
    $('#circuito_nombre').text('-');
  };
}
function get_zona_by_id_desde_indexedDB() {
  const transaction   = db.transaction([DB_STORE_NAME_FOUR], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_FOUR);
  const request       = objectStore.get(Id_Zona);
  request.onsuccess = function (e) {
    $('#zona_nombre').text(request.result.Zona);
  };
  request.onerror = function() {
    $('#zona_nombre').text('-');
  };
}
function get_calle_by_id_desde_indexedDB() {
  const transaction   = db.transaction([DB_STORE_NAME_FIVE], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_FIVE);
  const request       = objectStore.get(Id_Calle);
  request.onsuccess = function (e) {
    $('#calle_nombre').text(request.result.Calle);
  };
  request.onerror = function() {
    $('#calle_nombre').text('-');
  };
}
function obtener_direccion_CZC_desde_indexedDB() {
  get_circuito_by_id_desde_indexedDB();  /* Leer Circuito by Id_Circuito */
  get_zona_by_id_desde_indexedDB();      /* Leer Zona by Id_Zona */
  get_calle_by_id_desde_indexedDB();     /* Leer Calle by Id_Calle */
  $('#mes_registro').text(Anio_Mes);
}