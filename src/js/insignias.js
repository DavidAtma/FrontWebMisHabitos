document.addEventListener('DOMContentLoaded', () => {
  prepararEventosInsignias();
});

function prepararEventosInsignias() {
  // Botón Nueva Insignia
  const btnNueva = document.getElementById("nuevaInsigniaBtn");
  if (btnNueva) {
    btnNueva.addEventListener("click", () => {
      document.getElementById("idInsignia").value = "";
      document.getElementById("nombreInsignia").value = "";
      document.getElementById("descripcionInsignia").value = "";
      document.getElementById("criterioInsignia").value = "";
      document.getElementById("iconoInsignia").value = "";
      document.getElementById("estadoInsignia").value = "1";
      document.getElementById("modalInsigniaLabel").innerText = "Nueva Insignia";
    });
  }

  // Botón Guardar
  const btnGuardar = document.getElementById("guardarInsigniaBtn");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const id = document.getElementById("idInsignia").value;
      const nombre = document.getElementById("nombreInsignia").value;
      const descripcion = document.getElementById("descripcionInsignia").value;
      const criterio = document.getElementById("criterioInsignia").value;
      const icono = document.getElementById("iconoInsignia").value;
      const estado = document.getElementById("estadoInsignia").value;

      // Aquí iría la llamada al backend con fetch/AJAX
      console.log(id ? "Actualizando" : "Creando", { id, nombre, descripcion, criterio, icono, estado });

      mostrarToast("Insignia guardada correctamente");

      const modal = bootstrap.Modal.getInstance(document.getElementById("modalInsignia"));
      modal.hide();
    });
  }
}

// Cargar datos al editar
function cargarDatosInsignia(id, nombre, descripcion, criterio, icono, estado) {
  document.getElementById("idInsignia").value = id;
  document.getElementById("nombreInsignia").value = nombre;
  document.getElementById("descripcionInsignia").value = descripcion;
  document.getElementById("criterioInsignia").value = criterio;
  document.getElementById("iconoInsignia").value = icono;
  document.getElementById("estadoInsignia").value = estado;
  document.getElementById("modalInsigniaLabel").innerText = "Editar Insignia";
}

// Eliminar
function eliminarInsignia(id) {
  if (confirm(`¿Seguro que deseas eliminar la insignia con ID ${id}?`)) {
    console.log("Eliminando insignia:", id);
    mostrarToast("Insignia eliminada");
    // Aquí también irá el fetch DELETE al backend
  }
}

// Toast
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
