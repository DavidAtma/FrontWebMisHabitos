// js/usuarios.js
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();

  // Abrir modal para nuevo usuario
  document
    .getElementById("nuevoUsuarioBtn")
    ?.addEventListener("click", () => {
      limpiarFormularioUsuario();
      const modalEl = document.getElementById("modalEditarUsuario");
      if (modalEl) new bootstrap.Modal(modalEl).show();
    });

  // Guardar usuario (POST o PUT)
document
  .getElementById("guardarUsuarioBtn") // <- Aquí estás usando el ID correcto
  ?.addEventListener("click", guardarUsuario);

});

async function cargarUsuarios() {
  const tablaBody = document.getElementById("tablaUsuariosBody");
  if (!tablaBody) return;

  tablaBody.innerHTML =
    '<tr><td colspan="11" class="text-center">Cargando usuarios...</td></tr>';

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No autenticado");

    const res = await fetch("http://localhost:3000/api/v1/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { data } = await res.json();

    tablaBody.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      tablaBody.innerHTML =
        '<tr><td colspan="11" class="text-center">No hay usuarios registrados</td></tr>';
      return;
    }

    data.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.idUsuario}</td>
        <td>${u.nombre || ""}</td>
        <td>${u.apellidoPaterno || "-"}</td>
        <td>${u.apellidoMaterno || "-"}</td>
        <td>${u.correo}</td>
        <td>••••••••</td>
        <td>${u.rol?.nombre || "Sin rol"}</td>
        <td>${
          u.fechaNacimiento ? u.fechaNacimiento.split("T")[0] : "-"
        }</td>
        <td>${new Date(u.fechaCreacion).toLocaleString()}</td>
        <td>
          <span class="badge ${
            u.estado ? "bg-success" : "bg-danger"
          }">${u.estado ? "Activo" : "Inactivo"}</span>
        </td>
        <td>
          ${
            u.estado
              ? `<button class="btn btn-warning btn-sm me-1" onclick="editarUsuario(${u.idUsuario})">
                   <i class="bi bi-pencil"></i>
                 </button>
                 <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${u.idUsuario})">
                   <i class="bi bi-trash"></i>
                 </button>`
              : `<button class="btn btn-success btn-sm" onclick="activarUsuario(${u.idUsuario})">
                   <i class="bi bi-check-circle"></i>
                 </button>`
          }
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error al cargar usuarios:", err);
    tablaBody.innerHTML = `<tr><td colspan="11" class="text-center text-danger">${err.message}</td></tr>`;
    if (
      (err.message.includes("token") || err.message.includes("401")) &&
      typeof cerrarSesion === "function"
    ) {
      cerrarSesion();
    }
  }
}

document.getElementById("guardarUsuarioBtn")?.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) return alert("No autenticado.");

  const id = document.getElementById("idUsuario").value;

  const nombre = document.getElementById("nombreUsuario").value.trim();
  const apellidoPaterno = document.getElementById("apellidoPaterno").value.trim();
  const apellidoMaterno = document.getElementById("apellidoMaterno").value.trim();
  const correo = document.getElementById("correoUsuario").value.trim();
  const contrasena = document.getElementById("contrasenaUsuario").value.trim();
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const idRol = parseInt(document.getElementById("rolUsuario").value, 10);
  const estado = document.getElementById("estadoUsuario").value === "1";
  const fotoPerfil = document.getElementById("fotoPerfil").value.trim();

  if (!nombre || !correo || (!id && !contrasena)) {
    return alert("Completa todos los campos requeridos.");
  }

  const payload = {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    correo,
    fechaNacimiento,
    rol: { idRol },
    estado,
    fotoPerfil
  };

  if (!id) {
    payload.contrasena = contrasena; // solo en nuevo usuario
  } else if (contrasena) {
    payload.contrasena = contrasena; // si está editando y la cambió
  }

  const url = id
    ? `http://localhost:3000/api/v1/usuarios/${id}`
    : `http://localhost:3000/api/v1/usuarios`;

  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("🖥 respuesta guardar:", res.status, data); // para debug

    if (res.ok) {
      document.getElementById("formEditarUsuario").reset();
      bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario")).hide();
      cargarUsuarios();
    } else {
      alert(data.message || "No se pudo guardar el usuario.");
    }
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    alert("Error al guardar usuario.");
  }
});


function editarUsuario(idUsuario) {
  console.log("✏️ editarUsuario()", idUsuario); // depuración
  fetch(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then((r) => r.json())
    .then(({ data }) => {
      document.getElementById("idUsuario").value = data.idUsuario;
      document.getElementById("nombreUsuario").value = data.nombre || "";
      document.getElementById("apellidoPaterno").value =
        data.apellidoPaterno || "";
      document.getElementById("apellidoMaterno").value =
        data.apellidoMaterno || "";
      document.getElementById("correoUsuario").value = data.correo || "";
      document.getElementById("contrasenaUsuario").value = "";
      document.getElementById("fechaNacimiento").value =
        data.fechaNacimiento?.split("T")[0] || "";
      document.getElementById("rolUsuario").value = data.rol?.idRol || "1";
      document.getElementById("estadoUsuario").value = data.estado
        ? "1"
        : "0";
      document.getElementById("fotoPerfil").value = data.fotoPerfil || "";

      const modalEl = document.getElementById("modalEditarUsuario");
      if (modalEl) new bootstrap.Modal(modalEl).show();
    })
    .catch((err) => {
      console.error("Error al cargar usuario para editar:", err);
      alert("No se pudo cargar el usuario.");
    });
}

function eliminarUsuario(idUsuario) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
  fetch(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.success) cargarUsuarios();
      else alert("No se pudo eliminar el usuario.");
    })
    .catch((err) => {
      console.error("Error al eliminar usuario:", err);
      alert("Error al eliminar usuario.");
    });
}

function activarUsuario(idUsuario) {
  if (!confirm("¿Deseas activar este usuario?")) return;
  fetch(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ estado: true }),
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.success) cargarUsuarios();
      else alert("No se pudo activar el usuario.");
    })
    .catch((err) => {
      console.error("Error al activar usuario:", err);
      alert("Error al activar usuario.");
    });
}

function limpiarFormularioUsuario() {
  const form = document.getElementById("formEditarUsuario");
  if (form) form.reset();
  document.getElementById("idUsuario").value = "";
  document.getElementById("estadoUsuario").value = "1";
}

// Hacemos disponibles estas funciones globalmente
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.activarUsuario = activarUsuario;
