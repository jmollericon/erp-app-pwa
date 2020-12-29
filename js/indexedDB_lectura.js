let data_direcciones = {};
function openDB() {
  console.log("abriendo openDB");
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onsuccess = function (evt) {
    db = this.result;
    console.log("openDB DONE");
    verificar_inicio_sesion_lectura();
    renderizar_lecturas_desde_indexedDB();
    obtener_direcciones_desde_indexedDB() /* Circuitos, Zonas y Calles */
    prueba();
  };
  request.onerror = function (evt) {
    console.error("openDB:", evt.target.errorCode);
  };
}
function verificar_inicio_sesion_lectura() {
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

function prueba() {
  console.log('prueba')
  let data_lecturas  = [];
  const transaction   = db.transaction([DB_STORE_NAME_SIX], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_SIX);
  //const request       = objectStore.get('2020-01');

  var myIndex = objectStore.index('estado');
  var request = myIndex.get(1);
  //const request       = objectStore.get('estado');
  request.onsuccess = function (e) {
    console.log(request.result)
    if(request.result)
      console.log(request.result.mes)
    /*const cursor    = e.target.result;
    if(cursor) {
      data_lecturas.push(cursor.value)
      cursor.continue();
    } else {
      console.log(data_lecturas)
    }*/
  };
  request.onerror = function() {
    time_alert('error', '', 'Error en la lectura de datos.', 2000)
  };
}

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
          <li
            ${(l.estado == 0) ? `onclick="ver_lectura_mes_cerrado('${btoa(JSON.stringify(l))}')"`:`onclick="registrar_lectura_mes('${btoa(JSON.stringify(l))}')"`}
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <span><i class="fa fa-calendar-check-o"></i>&nbsp; ${l.mes_literal}</span>
            <div>
              ${(l.estado == 0) ? '<label class="badge badge-danger">CERRADO</label>':'<label class="badge badge-success">ACTIVO</label>'}
              <span class="badge badge-primary badge-pill">${l.cantidad_registros}</span>
            </div>
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
function registrar_mes_indexedDB(mes, mes_literal, cantidad_registros, fecha_registros, estado) {
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
        const data_lectura  = { mes, mes_literal, username, cantidad_registros, fecha_registros, estado, created_at };
        const transaction   = db.transaction([DB_STORE_NAME_SIX], 'readwrite')
        const objectStore   = transaction.objectStore(DB_STORE_NAME_SIX)

        const myIndex       = objectStore.index('estado');
        const request       = myIndex.get(1); // estado: 1
        request.onsuccess = function (e) {
          let mes_key = '';
          if(request.result)
            mes_key = request.result.mes;

          const request2 = objectStore.add(data_lectura);
          request2.onsuccess = function (evt) {
            if(mes_key != '') {
              console.log('poner estado = 0', mes_key);
              const request3 = objectStore.get(mes_key);
              request3.onsuccess = function (evt) {
                const data_mes = request3.result;
                data_mes.estado = 0;
                const request4 = objectStore.put(data_mes);
                request4.onsuccess = function (evt) {
                  console.log('actualizado')
                }
                request4.onerror = function() {
                  console.log("error al cambiar de estado x2", this.error);
                };
              }
              request3.onerror = function() {
                console.log("error al cambiar de estado", this.error);
              };
            }
            renderizar_lecturas_desde_indexedDB();
            time_alert('success', '', 'Registrado!.', 2000)
            .then(() => {
              $('#modal_nuevo_registro').modal('hide');
            });
          };
          request2.onerror = function() {
            console.log("data lectura error", this.error);
            time_alert('error', '', 'Mes ya registrado.', 2000)
          };
        };
      /*}*/
    } else {
      window.location = './index.html';
    }
  }
}
// Obtener Circuitos, Zonas y Calles
function get_circuitos_desde_indexedDB() {
  let circuitos       = [];
  const response      = {};
  const transaction   = db.transaction([DB_STORE_NAME_THREE], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_THREE);
  const request       = objectStore.openCursor();
  request.onsuccess = function (e) {
    const cursor    = e.target.result;
    if(cursor) {
      circuitos.push(cursor.value);
      cursor.continue();
    } else {
      response.read = 'success';
      response.data = circuitos;
    }
  };
  request.onerror = function() {
    response.read = 'error';
  };
  return response;
}
function get_zonas_desde_indexedDB() {
  let zonas           = [];
  const response      = {};
  const transaction   = db.transaction([DB_STORE_NAME_FOUR], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_FOUR);
  const request       = objectStore.openCursor();
  request.onsuccess = function (e) {
    const cursor      = e.target.result;
    if(cursor) {
      zonas.push(cursor.value);
      cursor.continue();
    } else {
      response.read = 'success';
      response.data = zonas;
    }
  };
  request.onerror = function() {
    response.read = 'error';
  };
  return response;
}
function get_calles_desde_indexedDB() {
  let calles          = [];
  const response      = {};
  const transaction   = db.transaction([DB_STORE_NAME_FIVE], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_FIVE);
  const request       = objectStore.openCursor();
  request.onsuccess = function (e) {
    const cursor      = e.target.result;
    if(cursor) {
      calles.push(cursor.value);
      cursor.continue();
    } else {
      response.read = 'success';
      response.data = calles;
    }
  };
  request.onerror = function() {
    response.read = 'error';
  };
  return response;
}
function obtener_direcciones_desde_indexedDB() {
  /* data_direcciones se usa desde lectura.html */
  data_direcciones.circuitos = get_circuitos_desde_indexedDB();  /* Leer Circuitos */
  data_direcciones.zonas     = get_zonas_desde_indexedDB();      /* Leer Zonas */
  data_direcciones.calles    = get_calles_desde_indexedDB();     /* Leer Calles */
}
// Registrar lectura_registros (datos de lectura de un mes x)
function actualizar_lectura_registro_indexedDB(data_lectura_registro) {
  return new Promise((resolve, reject) => {
    const response    = {};
    const transaction = db.transaction([DB_STORE_NAME_SEVEN], 'readwrite')
    const objectStore = transaction.objectStore(DB_STORE_NAME_SEVEN)
    const request     = objectStore.clear(); // Elimina todo del otro mes
    request.onsuccess = function (evt) {
      response.clear = true;
      let c = 0;
      data_lectura_registro.forEach( lr => {
        const request2 = objectStore.add(lr)
        request2.onsuccess = function (evt) {
          c++;
          response.add = true;
          response.contador = c;
        };
        request2.onerror = function() {
          response.add = false;
        };
      });
    };
    request.onerror = function() {
      response.clear = false;
    };
    transaction.oncomplete = function () {
      resolve(response);
    }
  });
}
// Actualizar registro data_lectura (cantidad_registros & fecha_registros)
function actualizar_data_lectura_indexedDB(data_lectura, mes_key) {
  return new Promise((resolve, reject) => {
    const response    = {};
    const transaction = db.transaction([DB_STORE_NAME_SIX], 'readwrite');
    const objectStore = transaction.objectStore(DB_STORE_NAME_SIX);
    const request = objectStore.get(mes_key);
    request.onsuccess = function (evt) {
      response.get = true;
      const data_lectura_actualizado = request.result;
      data_lectura_actualizado.cantidad_registros = data_lectura.cantidad_registros;
      data_lectura_actualizado.fecha_registros    = data_lectura.fecha_registros;
      const request2 = objectStore.put(data_lectura_actualizado);
      request2.onsuccess = function (evt) {
        response.put = true;
      }
      request.onerror = function() {
        response.put = false;
      };
    };
    request.onerror = function() {
      response.get = false;
    };
    transaction.oncomplete = function () {
      resolve(response);
    }
  });
}
