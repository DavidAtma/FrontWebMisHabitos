const HABITOS_API = "http://localhost:3000/api/v1/habitos";

document.addEventListener("DOMContentLoaded", () => {
  cargarHabitos(); // Llamar a cargarHabitos cuando se carga la página
  prepararEventosHabitos(); // Preparar los eventos para crear/editar el hábito
});

// Cargar hábitos en la tabla
async function cargarHabitos() {
  const token = localStorage.getItem("token");
  const tablaBody = document.getElementById("tablaHabitosBody");

  if (!tablaBody) return;

  tablaBody.innerHTML = '<tr><td colspan="9" class="text-center">Cargando hábitos...</td></tr>';

  try {
    const res = await fetch(HABITOS_API, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const { data } = await res.json();
    tablaBody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="9" class="text-center">No hay hábitos registrados</td></tr>';
      return;
    }

    data.forEach(habito => {
      const usuarioNombreCompleto = `${habito.usuario.nombre} ${habito.usuario.apellidoPaterno || ''} ${habito.usuario.apellidoMaterno || ''}`.trim();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${habito.idHabito}</td>
        <td>${usuarioNombreCompleto}</td> <!-- Mostrar nombre completo con apellidos -->
        <td>${habito.categoria.nombre}</td>
        <td>${habito.nombre}</td>
        <td>${habito.descripcion}</td>
        <td>${habito.horaSugerida}</td>
        <td>${new Date(habito.fechaCreacion).toLocaleDateString()}</td>
        <td><span class="badge ${habito.estado ? "bg-success" : "bg-danger"}">${habito.estado ? "Activo" : "Inactivo"}</span></td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarHabito(${habito.idHabito})">
            <i class="bi bi-pencil"></i> Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="eliminarHabito(${habito.idHabito})">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </td>
      `;
      tablaBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar hábitos:", error);
    tablaBody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">${error.message}</td></tr>`;
  }
}

// Editar hábito
async function editarHabito(id) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${HABITOS_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data } = await res.json();

    document.getElementById("idHabito").value = data.idHabito;
    document.getElementById("usuarioHabito").value = data.usuario.idUsuario;
    document.getElementById("categoriaHabito").value = data.categoria.idCategoria;
    document.getElementById("nombreHabito").value = data.nombre;
    document.getElementById("descripcionHabito").value = data.descripcion;
    document.getElementById("horaHabito").value = data.horaSugerida;
    document.getElementById("estadoHabito").value = data.estado ? "1" : "0";

    document.getElementById("modalHabitoLabel").innerText = "Editar Hábito";
    const modal = new bootstrap.Modal(document.getElementById("modalHabito"));
    modal.show();
  } catch (error) {
    console.error("Error al cargar el hábito:", error);
    alert("Error al cargar el hábito.");
  }
}

// Guardar o actualizar hábito
document.getElementById("guardarHabitoBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  const id = document.getElementById("idHabito").value;
  const usuario = document.getElementById("usuarioHabito").value;
  const categoria = document.getElementById("categoriaHabito").value;
  const nombre = document.getElementById("nombreHabito").value;
  const descripcion = document.getElementById("descripcionHabito").value;
  const hora = document.getElementById("horaHabito").value;
  const estado = document.getElementById("estadoHabito").value === "1";

  const payload = { usuario, categoria, nombre, descripcion, horaSugerida: hora, estado };

  const url = id ? `${HABITOS_API}/${id}` : HABITOS_API;
  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!result.success) throw new Error(result.message);

    cargarHabitos(); // Recargar la lista de hábitos
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalHabito"));
    modal.hide();
    mostrarToast("Hábito guardado correctamente");

  } catch (error) {
    console.error("Error al guardar hábito:", error);
    alert("Error al guardar el hábito.");
  }
});

// Eliminar hábito
function eliminarHabito(id) {
  const confirmar = confirm("¿Estás seguro de eliminar este hábito?");
  if (!confirmar) return;

  const token = localStorage.getItem("token");

  fetch(`${HABITOS_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        cargarHabitos(); // Recargar la lista de hábitos
        alert("Hábito eliminado correctamente");
      } else {
        alert("Error al eliminar: " + json.message);
      }
    })
    .catch(err => {
      console.error("Error al eliminar hábito:", err);
      alert("No se pudo eliminar el hábito.");
    });
}

// Limpiar formulario para nuevo hábito
function limpiarFormularioHabito() {
  document.getElementById("idHabito").value = "";
  document.getElementById("usuarioHabito").value = "";
  document.getElementById("categoriaHabito").value = "";
  document.getElementById("nombreHabito").value = "";
  document.getElementById("descripcionHabito").value = "";
  document.getElementById("horaHabito").value = "";
  document.getElementById("estadoHabito").value = "1";

  document.getElementById("modalHabitoLabel").innerText = "Nuevo Hábito";
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

// Preparar eventos para el botón nuevo hábito
function prepararEventosHabitos() {
  const btnNuevo = document.getElementById("nuevoHabitoBtn");
  if (btnNuevo) {
    btnNuevo.addEventListener("click", () => {
      limpiarFormularioHabito(); // Limpiar los campos del formulario al crear nuevo hábito
      document.getElementById("modalHabitoLabel").innerText = "Nuevo Hábito"; // Cambiar el título del modal
    });
  }
}