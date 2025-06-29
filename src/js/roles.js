document.addEventListener('DOMContentLoaded', () => {
  prepararEventosRoles();
});

function prepararEventosRoles() {
  // Nuevo Rol
  const btnNuevo = document.getElementById("nuevoRolBtn");
  if (btnNuevo) {
    btnNuevo.addEventListener("click", () => {
      document.getElementById("idRol").value = "";
      document.getElementById("nombreRol").value = "";
      document.getElementById("estadoRol").value = "1";
      document.getElementById("modalEditarRolLabel").innerText = "Nuevo Rol";
    });
  }

  // Guardar cambios
  const btnGuardar = document.getElementById("guardarRolBtn");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const id = document.getElementById("idRol").value;
      const nombre = document.getElementById("nombreRol").value;
      const estado = document.getElementById("estadoRol").value;

      console.log(`Rol ${id ? "actualizado" : "creado"}: ${nombre} (${estado})`);
      mostrarToast("Rol guardado correctamente");

      const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarRol"));
      modal.hide();
    });
  }
}

// Función para cargar datos en el formulario
function cargarDatosRol(id, nombre, estado) {
  document.getElementById("idRol").value = id;
  document.getElementById("nombreRol").value = nombre;
  document.getElementById("estadoRol").value = estado;
  document.getElementById("modalEditarRolLabel").innerText = "Editar Rol";
}

// Función para eliminar un rol
function eliminarRol(id) {
  const confirmar = confirm(`¿Seguro que deseas eliminar el rol con ID ${id}?`);
  if (confirmar) {
    console.log("Rol eliminado:", id);
    mostrarToast("Rol eliminado");
  }
}

// Función para mostrar un toast
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
