document.addEventListener('DOMContentLoaded', () => {
  prepararEventosUsuarios();
});

function prepararEventosUsuarios() {
  const btnNuevo = document.getElementById("nuevoUsuarioBtn");
  const btnGuardar = document.getElementById("guardarUsuarioBtn");

  if (btnNuevo) {
    btnNuevo.addEventListener("click", () => {
      limpiarFormularioUsuario();
      document.getElementById("modalEditarUsuarioLabel").innerText = "Nuevo Usuario";
    });
  }

  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const id = document.getElementById("idUsuario").value;
      const nombre = document.getElementById("nombreUsuario").value;
      const apellidoP = document.getElementById("apellidoPaterno").value;
      const apellidoM = document.getElementById("apellidoMaterno").value;
      const correo = document.getElementById("correoUsuario").value;
      const contrasena = document.getElementById("contrasenaUsuario").value;
      const fechaNacimiento = document.getElementById("fechaNacimiento").value;
      const rol = document.getElementById("rolUsuario").value;
      const estado = document.getElementById("estadoUsuario").value;
      const fotoPerfil = document.getElementById("fotoPerfil").value;

      console.log(id ? "Actualizando" : "Creando", {
        nombre, apellidoP, apellidoM, correo, contrasena, fechaNacimiento, rol, estado, fotoPerfil
      });

      mostrarToast("Usuario guardado correctamente");

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario"));
      modal.hide();
    });
  }
}

function cargarDatosUsuario(id, nombre, apellidoP, apellidoM, correo, contrasena, fechaNacimiento, rol, estado, fotoPerfil) {
  // Simulación de carga de datos, se puede reemplazar con datos reales
  document.getElementById("idUsuario").value = id;
  document.getElementById("nombreUsuario").value = "Anthony";
  document.getElementById("apellidoPaterno").value = "Gutierrez";
  document.getElementById("apellidoMaterno").value = "Lopez";
  document.getElementById("correoUsuario").value = "anthony@example.com";
  document.getElementById("contrasenaUsuario").value = "********";
  document.getElementById("fechaNacimiento").value = "2004-05-12";
  document.getElementById("rolUsuario").value = "1";
  document.getElementById("estadoUsuario").value = "1";
  document.getElementById("fotoPerfil").value = "https://miapp.com/foto.jpg";

  document.getElementById("modalEditarUsuarioLabel").innerText = "Editar Usuario";
}

function eliminarUsuario(id) {
  const confirmar = confirm(`¿Seguro que deseas eliminar el usuario con ID ${id}?`);
  if (confirmar) {
    console.log("Usuario eliminado:", id);
    mostrarToast("Usuario eliminado correctamente");
  }
}

function nuevoUsuario() {
  document.getElementById("idUsuario").value = "";
  document.getElementById("nombreUsuario").value = "";
  document.getElementById("apellidoPaterno").value = "";
  document.getElementById("apellidoMaterno").value = "";
  document.getElementById("correoUsuario").value = "";
  document.getElementById("contrasenaUsuario").value = "";
  document.getElementById("fechaNacimiento").value = "";
  document.getElementById("idRolUsuario").value = "";
  document.getElementById("estadoUsuario").value = "1";

  document.getElementById("modalUsuarioLabel").innerText = "Nuevo Usuario";
}

function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-white bg-success border-0 show position-fixed bottom-0 end-0 m-3";
  toast.setAttribute("role", "alert");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
