document.addEventListener("DOMContentLoaded", () => {
  prepararEventosHabitos();
});

function prepararEventosHabitos() {
  const btnNuevo = document.getElementById("nuevoHabitoBtn");
  const btnGuardar = document.getElementById("guardarHabitoBtn");

  if (btnNuevo) {
    btnNuevo.addEventListener("click", () => {
      limpiarFormularioHabito();
      document.getElementById("modalHabitoLabel").innerText = "Nuevo Hábito";
    });
  }

  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const id = document.getElementById("idHabito").value;
      const usuario = document.getElementById("usuarioHabito").value;
      const categoria = document.getElementById("categoriaHabito").value;
      const nombre = document.getElementById("nombreHabito").value;
      const descripcion = document.getElementById("descripcionHabito").value;
      const hora = document.getElementById("horaHabito").value;
      const estado = document.getElementById("estadoHabito").value;

      console.log(`${id ? "Actualizar" : "Crear"} hábito:`, {
        id, usuario, categoria, nombre, descripcion, hora, estado
      });

      mostrarToast("Hábito guardado correctamente");

      const modal = bootstrap.Modal.getInstance(document.getElementById("modalHabito"));
      modal.hide();
    });
  }
}

function cargarDatosHabito(id, usuario, categoria, nombre, descripcion, hora, estado) {
  document.getElementById("idHabito").value = id;
  document.getElementById("usuarioHabito").value = usuario;
  document.getElementById("categoriaHabito").value = categoria;
  document.getElementById("nombreHabito").value = nombre;
  document.getElementById("descripcionHabito").value = descripcion;
  document.getElementById("horaHabito").value = hora;
  document.getElementById("estadoHabito").value = estado;

  document.getElementById("modalHabitoLabel").innerText = "Editar Hábito";
}

function eliminarHabito(id) {
  if (confirm(`¿Deseas eliminar el hábito con ID ${id}?`)) {
    console.log("Hábito eliminado:", id);
    mostrarToast("Hábito eliminado");
  }
}

function limpiarFormularioHabito() {
  document.getElementById("idHabito").value = "";
  document.getElementById("usuarioHabito").value = "";
  document.getElementById("categoriaHabito").value = "";
  document.getElementById("nombreHabito").value = "";
  document.getElementById("descripcionHabito").value = "";
  document.getElementById("horaHabito").value = "";
  document.getElementById("estadoHabito").value = "1";
}

// Función reutilizable para mostrar mensajes
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

  setTimeout(() => toast.remove(), 3000);
}
