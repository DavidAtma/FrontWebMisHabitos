document.addEventListener('DOMContentLoaded', () => {
  prepararEventosFrases();
});

function prepararEventosFrases() {
  // Botón Nueva Frase
  const btnNueva = document.getElementById("nuevaFraseBtn");
  if (btnNueva) {
    btnNueva.addEventListener("click", () => {
      limpiarFormularioFrase();
      document.getElementById("modalFraseLabel").innerText = "Nueva Frase";
    });
  }

  // Botón Guardar Frase
  const btnGuardar = document.getElementById("guardarFraseBtn");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const id = document.getElementById("idFrase").value;
      const frase = document.getElementById("fraseTexto").value;
      const autor = document.getElementById("autorFrase").value;
      const estado = document.getElementById("estadoFrase").value;

      console.log(`Frase ${id ? "editada" : "creada"}: "${frase}" - ${autor} (${estado})`);

      mostrarToast("Frase guardada correctamente");

      const modal = bootstrap.Modal.getInstance(document.getElementById("modalFrase"));
      modal.hide();
    });
  }
}

function cargarDatosFrase(id, frase, autor, estado) {
  document.getElementById("idFrase").value = id;
  document.getElementById("fraseTexto").value = frase;
  document.getElementById("autorFrase").value = autor;
  document.getElementById("estadoFrase").value = estado;
  document.getElementById("modalFraseLabel").innerText = "Editar Frase";
}

function eliminarFrase(id) {
  const confirmar = confirm(`¿Seguro que deseas eliminar la frase con ID ${id}?`);
  if (confirmar) {
    console.log("Frase eliminada:", id);
    mostrarToast("Frase eliminada correctamente");
  }
}

function limpiarFormularioFrase() {
  document.getElementById("idFrase").value = "";
  document.getElementById("fraseTexto").value = "";
  document.getElementById("autorFrase").value = "";
  document.getElementById("estadoFrase").value = "1";
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

  setTimeout(() => toast.remove(), 3000);
}
