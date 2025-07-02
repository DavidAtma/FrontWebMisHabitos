// usuarios.js corregido con soporte completo para registrar y editar usuarios
const API_URL = 'http://localhost:3000/api/v1/usuarios';

// ✅ Cargar automáticamente usuarios
cargarUsuarios();

async function cargarUsuarios() {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');

    const tablaBody = document.getElementById('tablaUsuariosBody');
    if (!tablaBody) throw new Error('Tabla no encontrada');

    tablaBody.innerHTML = '<tr><td colspan="11" class="text-center">Cargando usuarios...</td></tr>';

    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const { data } = await response.json();
    tablaBody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="11" class="text-center">No hay usuarios registrados</td></tr>`;
      return;
    }

    data.forEach(usuario => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${usuario.idUsuario}</td>
        <td>${usuario.nombre || ''}</td>
        <td>${usuario.apellidoPaterno || '-'}</td>
        <td>${usuario.apellidoMaterno || '-'}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.contrasena || '-'}</td>
        <td>${usuario.rol?.nombre || 'Sin rol'}</td>
        <td>${usuario.fechaNacimiento ? usuario.fechaNacimiento.split('T')[0] : '-'}</td>
        <td>${new Date(usuario.fechaCreacion).toLocaleString()}</td>
        <td>
          <span class="badge ${usuario.estado ? 'bg-success' : 'bg-danger'}">
            ${usuario.estado ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td class="action-btns">
          ${usuario.estado
            ? `<button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.idUsuario})">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.idUsuario})">
                <i class="bi bi-trash"></i> Eliminar
              </button>`
            : `<button class="btn btn-success btn-sm" onclick="activarUsuario(${usuario.idUsuario})">
                <i class="bi bi-check-circle"></i> Activar
              </button>`}
        </td>
      `;
      tablaBody.appendChild(row);
    });

  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    const tablaBody = document.getElementById('tablaUsuariosBody');
    if (tablaBody) {
      tablaBody.innerHTML = `<tr><td colspan="11" class="text-center text-danger">${error.message}</td></tr>`;
    }
    if (error.message.includes('token') || error.message.includes('401')) {
      cerrarSesion?.();
    }
  }
}

function limpiarFormularioUsuario() {
  document.getElementById("idUsuario").value = "";
  document.getElementById("nombreUsuario").value = "";
  document.getElementById("apellidoPaterno").value = "";
  document.getElementById("apellidoMaterno").value = "";
  document.getElementById("correoUsuario").value = "";
  document.getElementById("contrasenaUsuario").value = "";
  document.getElementById("fechaNacimiento").value = "";
  document.getElementById("rolUsuario").value = "";
  document.getElementById("estadoUsuario").value = "1";
  document.getElementById("fotoPerfil").value = "";
}

document.getElementById("nuevoUsuarioBtn")?.addEventListener("click", function () {
  limpiarFormularioUsuario();
  const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
  modal.show();
});

function editarUsuario(idUsuario) {
  const token = localStorage.getItem("token");

  fetch(`${API_URL}/${idUsuario}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(result => {
      const u = result.data;
      if (!u) throw new Error("Usuario no encontrado");

      document.getElementById("idUsuario").value = u.idUsuario;
      document.getElementById("nombreUsuario").value = u.nombre || "";
      document.getElementById("apellidoPaterno").value = u.apellidoPaterno || "";
      document.getElementById("apellidoMaterno").value = u.apellidoMaterno || "";
      document.getElementById("correoUsuario").value = u.correo || "";
      document.getElementById("contrasenaUsuario").value = ""; // No rellenar contraseña
      document.getElementById("fechaNacimiento").value = u.fechaNacimiento?.split("T")[0] || "";
      document.getElementById("rolUsuario").value = u.rol?.idRol || "";
      document.getElementById("estadoUsuario").value = u.estado ? "1" : "0";
      document.getElementById("fotoPerfil").value = u.fotoPerfil || "";

      const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
      modal.show();
    })
    .catch(error => {
      console.error("Error al cargar el usuario:", error);
      alert("Ocurrió un error al obtener los datos del usuario.");
    });
}

document.getElementById("guardarUsuarioBtn")?.addEventListener("click", async function () {
  const token = localStorage.getItem("token");

  const id = document.getElementById("idUsuario").value;
  const payload = {
    nombre: document.getElementById("nombreUsuario").value.trim(),
    apellidoPaterno: document.getElementById("apellidoPaterno").value.trim(),
    apellidoMaterno: document.getElementById("apellidoMaterno").value.trim(),
    correo: document.getElementById("correoUsuario").value.trim(),
    contrasena: document.getElementById("contrasenaUsuario").value.trim(),
    fechaNacimiento: document.getElementById("fechaNacimiento").value,
    rol: { idRol: parseInt(document.getElementById("rolUsuario").value) },
    estado: document.getElementById("estadoUsuario").value === "1",
    fotoPerfil: document.getElementById("fotoPerfil").value.trim()
  };

  // No enviar contraseña vacía en edición
  if (!id && !payload.contrasena) {
    alert("La contraseña es obligatoria para nuevos usuarios.");
    return;
  }
  if (id && payload.contrasena === "") delete payload.contrasena;

  const url = id ? `${API_URL}/${id}` : API_URL;
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

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Error al guardar usuario.");

    cargarUsuarios();
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario"));
    modal.hide();
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    alert("Error al guardar usuario.");
  }
});

function eliminarUsuario(idUsuario) {
  const token = localStorage.getItem("token");
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  fetch(`${API_URL}/${idUsuario}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        cargarUsuarios();
      } else {
        alert("Error al eliminar: " + json.message);
      }
    })
    .catch(err => {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el usuario.");
    });
}

function activarUsuario(idUsuario) {
  const token = localStorage.getItem("token");

  fetch(`${API_URL}/${idUsuario}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ estado: true })
  })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        cargarUsuarios();
      } else {
        alert("No se pudo activar el usuario.");
      }
    })
    .catch(error => {
      console.error("Error al activar usuario:", error);
      alert("Error al activar usuario.");
    });
}

window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.activarUsuario = activarUsuario;