document.addEventListener('DOMContentLoaded', () => {
  prepararEventosCategorias();
});

function prepararEventosCategorias() {
  // Botón Nuevo
  const btnNuevo = document.getElementById("nuevoCategoriaBtn");
  if (btnNuevo) {
    btnNuevo.addEventListener("click", () => {
      document.getElementById("idCategoria").value = "";
      document.getElementById("nombreCategoria").value = "";
      document.getElementById("estadoCategoria").value = "1";
      document.getElementById("modalCategoriaLabel").innerText = "Nueva Categoría";
    });
  }

  // Botón Guardar
  const btnGuardar = document.getElementById("guardarCategoriaBtn");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const id = document.getElementById("idCategoria").value;
      const nombre = document.getElementById("nombreCategoria").value;
      const estado = document.getElementById("estadoCategoria").value;

      console.log(`Categoría ${id ? "actualizada" : "nueva"}: ${nombre} (${estado})`);

      // Simular llamada al backend
      // Aquí el backend puede hacer POST o PUT dependiendo si hay ID

      mostrarToast("Categoría guardada correctamente");

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalCategoria"));
      modal.hide();
    });
  }
}

// Cargar datos al formulario
function cargarDatosCategoria(id, nombre, estado) {
  document.getElementById("idCategoria").value = id;
  document.getElementById("nombreCategoria").value = nombre;
  document.getElementById("estadoCategoria").value = estado;
  document.getElementById("modalCategoriaLabel").innerText = "Editar Categoría";
}

// Eliminar categoría
function eliminarCategoria(id) {
  const confirmar = confirm(`¿Seguro que deseas eliminar la categoría con ID ${id}?`);
  if (confirmar) {
    console.log("Categoría eliminada:", id);

    // Simular backend DELETE
    mostrarToast("Categoría eliminada");
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
