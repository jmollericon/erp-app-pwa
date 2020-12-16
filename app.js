const DB_NAME             = 'erp_app_db';
const DB_VERSION          = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME_ONE   = 'data_sesion';
const DB_STORE_NAME_TWO   = 'data_abonado';
const DB_STORE_NAME_THREE = 'data_circuito';
const DB_STORE_NAME_FOUR  = 'data_zona';
const DB_STORE_NAME_FIVE  = 'data_calle';
const DB_STORE_NAME_SIX   = 'data_lectura';
var db;

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