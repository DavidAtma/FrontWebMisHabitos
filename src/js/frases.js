const FRASES_API = "http://localhost:3000/api/v1/frases";

async function cargarFrases() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No autenticado");

    const tablaBody = document.getElementById("tablaFrasesBody");
    if (!tablaBody) throw new Error("Tabla no encontrada");

    tablaBody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando frases...</td></tr>';

    const response = await fetch(FRASES_API, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Error al cargar frases");
    }

    const { data } = await response.json();
    tablaBody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay frases registradas</td></tr>';
      return;
    }

    data.forEach(f => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${f.idFrase}</td>
        <td>${f.frase}</td>
        <td>${f.autor}</td>
        <td>${new Date(f.fechaCreacion).toLocaleDateString()}</td>
        <td><span class="badge ${f.estado ? "bg-success" : "bg-danger"}">
          ${f.estado ? "Activo" : "Inactivo"}</span></td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarFrase(${f.idFrase})">
            <i class="bi bi-pencil"></i> Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="eliminarFrase(${f.idFrase})">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </td>
      `;
      tablaBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error al cargar frases:", error);
    const tablaBody = document.getElementById("tablaFrasesBody");
    if (tablaBody) {
      tablaBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${error.message}</td></tr>`;
    }
  }
}

// Guardar nueva o editar
document.getElementById("guardarFraseBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const id = document.getElementById("idFrase").value;
  const frase = document.getElementById("fraseTexto").value;
  const autor = document.getElementById("autorFrase").value;
  const estado = document.getElementById("estadoFrase").value === "1";

  const payload = { frase, autor, estado };
  const url = id ? `${FRASES_API}/${id}` : FRASES_API;
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Error al guardar frase");

    cargarFrases();
    limpiarFormularioFrase();
    bootstrap.Modal.getInstance(document.getElementById("modalFrase")).hide();
    mostrarToast("Frase guardada correctamente");
  } catch (error) {
    console.error("Error al guardar frase:", error);
    alert(error.message || "Error al guardar frase");
  }
});

// Editar frase
async function editarFrase(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${FRASES_API}/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "No se pudo cargar la frase");
    }

    const { data } = await response.json();
    document.getElementById("idFrase").value = data.idFrase;
    document.getElementById("fraseTexto").value = data.frase;
    document.getElementById("autorFrase").value = data.autor;
    document.getElementById("estadoFrase").value = data.estado ? "1" : "0";

    document.getElementById("modalFraseLabel").innerText = "Editar Frase";
    new bootstrap.Modal(document.getElementById("modalFrase")).show();
  } catch (error) {
    console.error("Error al cargar la frase:", error);
    alert(error.message || "No se pudo cargar la frase.");
  }
}

// Eliminar frase
function eliminarFrase(id) {
  if (!confirm("¿Seguro que deseas eliminar esta frase?")) return;

  const token = localStorage.getItem("token");
  fetch(`${FRASES_API}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        cargarFrases();
        mostrarToast("Frase eliminada correctamente");
      } else {
        throw new Error(result.message || "No se pudo eliminar");
      }
    })
    .catch(err => {
      console.error("Error al eliminar frase:", err);
      alert(err.message || "No se pudo eliminar la frase.");
    });
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

// Eventos de botones al cargar
document.addEventListener("DOMContentLoaded", () => {
  cargarFrases();
  document.getElementById("nuevaFraseBtn")?.addEventListener("click", () => {
    limpiarFormularioFrase();
    document.getElementById("modalFraseLabel").innerText = "Nueva Frase";
  });
  document.getElementById("btnListarFrases")?.addEventListener("click", cargarFrases);
});
