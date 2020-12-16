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
// Actualizar Circuitos, Zonas y Calles en IndexedDB
function actualizar_circuitos(circuitos) {
  const response    = {};
  const transaction = db.transaction([DB_STORE_NAME_THREE], 'readwrite')
  const objectStore = transaction.objectStore(DB_STORE_NAME_THREE)
  const request     = objectStore.clear();
  request.onsuccess = function (evt) {
    response.clear = 'success';
    circuitos.forEach((c) => {
      const data_circuito = { Id_Circuito: c.Id_Circuito, Sigla: c.Sigla, Circuito : c.Circuito };
      const request = objectStore.add(data_circuito)
      request.onsuccess = function (evt) {
        response.add = 'success';
      };
      request.onerror = function() {
        response.add = 'error';
      };
    });
  };
  request.onerror = function() {
    response.clear = 'error';
  };
  return response;
}
function actualizar_zonas(zonas) {
  const response    = {};
  const transaction = db.transaction([DB_STORE_NAME_FOUR], 'readwrite')
  const objectStore = transaction.objectStore(DB_STORE_NAME_FOUR)
  const request     = objectStore.clear();
  request.onsuccess = function (evt) {
    response.clear = 'success';
    zonas.forEach((z) => {
      const data_zona = { Id_Zona: z.Id_Zona, Sigla: z.Sigla, Zona : z.Zona };
      const request = objectStore.add(data_zona)
      request.onsuccess = function (evt) {
        response.add = 'success';
      };
      request.onerror = function() {
        response.add = 'error';
      };
    });
  };
  request.onerror = function() {
    response.clear = 'error';
  };
  return response;
}
function actualizar_calles(calles) {
  const response    = {};
  const transaction = db.transaction([DB_STORE_NAME_FIVE], 'readwrite')
  const objectStore = transaction.objectStore(DB_STORE_NAME_FIVE)
  const request     = objectStore.clear();
  request.onsuccess = function (evt) {
    response.clear = 'success';
    calles.forEach((c) => {
      const data_calle = { Id_Calle: c.Id_Calle, Circuito: c.Circuito, Zona: c.Zona, Sigla: c.Sigla, Calle: c.Calle };
      const request = objectStore.add(data_calle)
      request.onsuccess = function (evt) {
        response.add = 'success';
      };
      request.onerror = function() {
        response.add = 'error';
      };
    });
  };
  request.onerror = function() {
    response.clear = 'error';
  };
  return response;
}
function almacenar_direcciones_indexedDB(data) {
  const res = {};
  // Circuitos
  res.circuitos = actualizar_circuitos(data.circuitos); /* Eliminar y añadir Circuitos */
  // Zonas
  res.zonas     = actualizar_zonas(data.zonas);         /* Eliminar y añadir Zonas */
  // Calles
  res.calles    = actualizar_calles(data.calles);       /* Eliminar y añadir Calles */
  return res;
}
// Renderizar Circuitos, Zonas y Calles en la vista desde IndexedDB
function leer_renderizar_circuitos() {
  let circuitos_html  = '';
  const response      = {};
  const transaction   = db.transaction([DB_STORE_NAME_THREE], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_THREE);
  const request       = objectStore.openCursor();
  request.onsuccess = function (e) {
    const cursor    = e.target.result;
    if(cursor) {
      circuitos_html += `<span>${cursor.value.Sigla} - ${cursor.value.Circuito}<span><br />`;
      cursor.continue();
    } else {
      $('#contenedor_circuitos').empty().append(circuitos_html);
    }
    response.read = 'success';
  };
  request.onerror = function() {
    response.read = 'error';
  };
}
function leer_renderizar_zonas() {
  let zonas_html      = '';
  const response      = {};
  const transaction   = db.transaction([DB_STORE_NAME_FOUR], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_FOUR);
  const request       = objectStore.openCursor();
  request.onsuccess = function (e) {
    const cursor      = e.target.result;
    if(cursor) {
      zonas_html      += `<span>${cursor.value.Sigla} - ${cursor.value.Zona}<span><br />`;
      cursor.continue();
    } else {
      $('#contenedor_zonas').empty().append(zonas_html);
    }
    response.read = 'success';
  };
  request.onerror = function() {
    response.read = 'error';
  };
}
function leer_renderizar_calles() {
  let calles_html     = '';
  const response      = {};
  const transaction   = db.transaction([DB_STORE_NAME_FIVE], 'readonly');
  const objectStore   = transaction.objectStore(DB_STORE_NAME_FIVE);
  const request       = objectStore.openCursor();
  request.onsuccess = function (e) {
    const cursor      = e.target.result;
    if(cursor) {
      calles_html += `<span>${cursor.value.Sigla} - ${cursor.value.Calle}<span><br />`;
      cursor.continue();
    } else {
      $('#contenedor_calles').empty().append(calles_html);
    }
    response.read = 'success';
  };
  request.onerror = function() {
    response.read = 'error';
  };
}
function renderizar_direcciones_desde_indexedDB() {
  const res = {};
  res.circuitos = leer_renderizar_circuitos();  /* Leer Circuitos */
  res.zonas     = leer_renderizar_zonas();      /* Leer Zonas */
  res.calles    = leer_renderizar_calles();     /* Leer Calles */

}