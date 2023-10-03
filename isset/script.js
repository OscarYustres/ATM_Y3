window.addEventListener("DOMContentLoaded", () => {
  escuchaEventoCuentas();
  escuchaEventoOpc();
  if (localStorage.getItem("usuarioLogeado") != null) {
      const inicioUsuarios = document.getElementById("inicio-usuarios");
      inicioUsuarios.classList.add("d-none")
      const operaciones = document.getElementById("operaciones");
      operaciones.classList.remove("d-none");
  }
});

const llamadaCuenta = function() {

  var cuentas = [
      { nombre: "Cuenta1", saldo: 200, password: '123456', id: 1, boton: 'Cuenta1' },
      { nombre: "Cuenta2", saldo: 290, password: '1aa2', id: 2, boton: 'Cuenta2' },
      { nombre: "Cuenta3", saldo: 67, password: '123zxcv', id: 3, boton: 'Cuenta3' }
  ];
  return cuentas;
}

function buscarCuentas(claseBoton, password) {
  const cuentas = llamadaCuenta();
  for (let i = 0; i < cuentas.length; i++) {
      if (password == cuentas[i].password && cuentas[i].boton == claseBoton) {
          return cuentas[i];
      }
  }
  return false;
}

const escuchaEventoCuentas = function(){

  const colDerecha = document.getElementById("col-derecha"); //obtenemos el elemento padre que es un div del html con un id llamado col-derecha
  // const cuentas = llamadaApi();
  colDerecha.addEventListener("click", (event) => {

      //  ******** BOTONES USUARIOS ***********//
      if ((event.target.tagName === "BUTTON" && event.target.classList.contains("Cuenta1")) || (event.target.tagName === "BUTTON" && event.target.classList.contains("Cuenta2")) || (event.target.tagName === "BUTTON" && event.target.classList.contains("Cuenta3"))) { //VALIDAR
         
          var claseBoton = event.target.classList[2]

          let nombreBienvenida = document.getElementById("usuario");
          const botonOpc = document.getElementById("boton-opc").getBoundingClientRect(); // para cambiar de vista en la misma pestaña
          var contador = 0;
          var intentos = 3;

          //*********USUARIOS-INICIO DE SESION*******/
          do {
              var contra = prompt("Ingrese su contraseña")
              let cuentaLog = buscarCuentas(claseBoton, contra)
              contador++;
              if (cuentaLog != false) {
                  Swal.fire(
                    '¡Bienvenido!',
                    'Clic en el boton!',
                    'success'
                    
                      
                  );
                  nombreBienvenida.innerHTML = `¡HOLA ${cuentaLog.nombre}!`;
                  // window.scroll({
                  //     top: botonOpc.top, behavior: "smooth"
                  // })
                  localStorage.setItem("usuarioLogeado", JSON.stringify(cuentaLog));
                  const inicioUsuarios = document.getElementById("inicio-usuarios");
                  inicioUsuarios.classList.add("d-none")
                  const operaciones = document.getElementById("operaciones");
                  operaciones.classList.remove("d-none");
                  break;
              }
              //cuando se ingresa la contraseña incorrecta deja intentarlo 2 veces mas
              else {
                  alert(`Contraseña incorrecta, tiene ${intentos--} intentos`)
                  if (intentos === 0) {
                      alert('Su cuenta ha sido bloqueda')
                      break;
                  }
              }
          } while (contador < 3);
      }
  })
}


//  ******** BOTONES OPCIONES ***********//
const escuchaEventoOpc = () => {
const cuentas = llamadaCuenta();
const colOpc = document.getElementById("col-operaciones");

  
colOpc.addEventListener("click", (event) => {

//  ******** BOTON CONSULTAR SALDO ***********//
if (event.target.tagName === "BUTTON" && event.target.classList.contains("c-saldo")) {
        const cuentaLog = JSON.parse(localStorage.getItem("usuarioLogeado"));
        alert(`El Saldo de su Cuenta es de:  $ ${cuentaLog.saldo}`)
    }

      //  ******** BOTON INGRESAR MONTO ***********//
      if (event.target.tagName === "BUTTON" && event.target.classList.contains("in-monto")) {
          const cuentaLog = JSON.parse(localStorage.getItem("usuarioLogeado"));
          console.log(cuentaLog);

          let ingreso = prompt("Digite el total de dinero a depositar");
          //validación para que el usuario unicamente ingrese números
          while (ingreso == null || /\D/.test(ingreso)) {
              ingreso = prompt("Ingrese un número Valido: ");
          };

          // valida que al no ingresar nada lo tome como 0
          if(ingreso == "" ){
              ingreso = 0;
          }

          //hace la suma del monto actual mas el monto ingresado
          let saldoIngreso = parseInt(cuentaLog.saldo) + parseInt(ingreso);

          //valida que el usuario no se pase de la cantidad máxima permitida
          if(saldoIngreso > 990){
              Swal.fire({
                  title: '¡ERROR!',
                  html: `<b> DIGITE OTRO MONTO, SU CUENTA NO PUEDE TENER MAS DE $990 </b>`,
                  widht: '90%',
                  icon: 'error'
              });
          }
          else{
              alert(`Usted tiene en su cuenta un total de $${saldoIngreso}`)
          localStorage.setItem("usuarioLogeado", JSON.stringify({
              ...cuentaLog,
              saldo: saldoIngreso
          }))
          }
      }

      //  ******** BOTON RETIRAR MONTO ***********//
      if (event.target.tagName === "BUTTON" && event.target.classList.contains("re-monto")) {
          const cuentaLog = JSON.parse(localStorage.getItem("usuarioLogeado"));
          
          let retiro = prompt("Digite el total de dinero a retirar");

          //validación para que el usuario unicamente ingrese números
          while (retiro == null || /\D/.test(retiro)) {
              retiro = prompt("Ingrese un número VÁLIDO: ");
          };

          // valida que al no ingresar nada lo tome como 0
          if(retiro == "" ){
              retiro = 0;
          }

          //hace la resta del saldo actual menos el monton ingresado
          let saldoRetiro = parseInt(cuentaLog.saldo) - parseInt(retiro);

          //valida que el usuario no pueda retirar menos del dinero que tiene en cuenta
          if(saldoRetiro < 10){
              Swal.fire({
                  title: '¡ERROR!',
                  html: `<b> DIGITE OTRO MONTO, SU CUENTA NO PUEDE TENER MENOS DE $10 </b>`,
                  widht: '90%',
                  icon: 'error'
              });
          }
          else{
              alert(`El saldo que Usted tiene en su cuenta es de $${saldoRetiro}`)
          localStorage.setItem("usuarioLogeado", JSON.stringify({
              ...cuentaLog,
              saldo: saldoRetiro
          }))
          console.log(saldoRetiro);
          }
          
      }
  })
}

//al presionar el boton de salir, limpia el localstorage y permite que se regrese a la pagina de inicio de sesion
const cerrarSesion = () => {
  localStorage.clear()
  const inicioUsuarios = document.getElementById("inicio-usuarios");
  inicioUsuarios.classList.remove("d-none")
  const operaciones = document.getElementById("operaciones");
  operaciones.classList.add("d-none");
}