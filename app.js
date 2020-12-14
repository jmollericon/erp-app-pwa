if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => {
      console.log('Registro de SW exitoso', reg)
      $('#msj').text('Registro de SW exitoso')
    }
    )
    .catch(err => {
      console.warn('Error al tratar de registrar el sw', err)
      $('#msj').text('Error al tratar de registrar el sw')
    })
}