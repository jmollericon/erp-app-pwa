if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => {
      console.log('Registro de SW exitoso', reg)
    }
    )
    .catch(err => {
      console.log('Error al tratar de registrar el sw', err)
    })
}
// indexedDB
/*var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
function startDB() {
  dataBase = indexedDB.open("erp_app_db", 1);
  dataBase.onupgradeneeded = function (e) {
    active    = dataBase.result;
    usuarios  = active.createObjectStore("data_sesion", { keyPath : 'id', autoIncrement : true });
    var username  = usuarios.createIndex('by_username', 'username', { unique : true });
    var name      = usuarios.createIndex('by_name', 'name', { unique : false });
    var user_type = usuarios.createIndex('by_user_type', 'user_type', { unique : false });
  };
  dataBase.onsuccess = function (e) {
    console.log('Base de datos cargada correctamente');
  };
  dataBase.onerror = function (e)  {
    console.log('Error cargando la base de datos');
  };
  return dataBase;
}
startDB();*/

function time_alert(type, title, message_html, time) {
  return new Promise((resolve, reject) => {
      Swal.fire({
          position: 'center',
          icon: type,
          title: title,
          html: message_html,
          showConfirmButton: false,
          timer: time
      }).then(() => resolve(true));
  })
  
}
function ok_alert(type, title, message_html) {
  return new Promise((resolve, reject) => {
      Swal.fire({
          position: 'center',
          icon: type,
          title: title,
          html: message_html,
          confirmButtonText: '<i class="fa fa-check" aria-hidden="true"></i> Aceptar',
      }).then(() => resolve(true));
  })
  
}
function msg_confirmation(type, title, message_html) {
  return new Promise((resolve, reject) => {
      Swal.fire({
          title: title,
          html: message_html,
          icon: type,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '<i class="fa fa-check" aria-hidden="true"></i> Aceptar',
          cancelButtonText: '<i class="fa fa-close" aria-hidden="true"></i> Cancelar'
      }).then((result) => {
          if (result.value)
              resolve(true);
          resolve(false);
      });
  });
}