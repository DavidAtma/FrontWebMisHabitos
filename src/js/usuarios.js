// ✅ Cargar automáticamente al iniciar
cargarUsuarios();

async function cargarUsuarios() {
  try {
    
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');

    const tablaBody = document.getElementById('tablaUsuariosBody');
    if (!tablaBody) throw new Error('Tabla no encontrada');

    tablaBody.innerHTML = '<tr><td colspan="11" class="text-center">Cargando usuarios...</td></tr>';

    const response = await fetch('http://localhost:3000/api/v1/usuarios', {
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
          ${
            usuario.estado
              ? `
                <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.idUsuario})">
                  <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.idUsuario})">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              `
              : `
                <button class="btn btn-success btn-sm" onclick="activarUsuario(${usuario.idUsuario})">
                  <i class="bi bi-check-circle"></i> Activar
                </button>
              `
          }
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

  const url = id ? `http://localhost:3000/api/v1/usuarios/${id}` : `http://localhost:3000/api/v1/usuarios`;
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
    console.log(json); // 👈 aquí verás el mensaje real del error en consola

    if (res.ok) {
      cargarUsuarios();

      // Ocultar modal correctamente después de agregar el usuario
      const modalElement = document.getElementById("modalEditarUsuario");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide(); // Cierra el modal después de éxito

      limpiarFormularioUsuario(); // Limpia el formulario
    } else {
      alert(json.message || "Error al guardar usuario.");
    }
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    alert("Error al guardar usuario.");
  }
});



// Editar usuario
function editarUsuario(idUsuario) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(({ data }) => {
      document.getElementById("idUsuario").value = data.idUsuario;
      document.getElementById("nombreUsuario").value = data.nombre;
      document.getElementById("apellidoPaterno").value = data.apellidoPaterno;
      document.getElementById("apellidoMaterno").value = data.apellidoMaterno;
      document.getElementById("correoUsuario").value = data.correo;
      document.getElementById("contrasenaUsuario").value = "";
      document.getElementById("fechaNacimiento").value = data.fechaNacimiento?.split("T")[0] || "";
      document.getElementById("rolUsuario").value = data.rol?.idRol || "";
      document.getElementById("estadoUsuario").value = data.estado ? "1" : "0";
      document.getElementById("fotoPerfil").value = data.fotoPerfil || "";

      const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
      modal.show();
    })
    .catch(error => {
      console.error("Error al cargar el usuario:", error);
      alert("No se pudo cargar el usuario.");
    });
}

// Eliminar usuario
function eliminarUsuario(idUsuario) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  fetch(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        cargarUsuarios();
      } else {
        alert("No se pudo eliminar el usuario.");
      }
    })
    .catch(error => {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar.");
    });
}

// Activar usuario
function activarUsuario(idUsuario) {
  if (!confirm("¿Deseas activar este usuario?")) return;

  const token = localStorage.getItem("token");

  fetch(`http://localhost:3000/api/v1/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ estado: true })
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
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

// Mostrar modal para nuevo usuario
document.getElementById("nuevoUsuarioBtn")?.addEventListener("click", () => {
  limpiarFormularioUsuario();
  const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
  modal.show();
});

// Limpiar formulario
function limpiarFormularioUsuario() {
document.getElementById("formEditarUsuario").reset();
  document.getElementById("idUsuario").value = "";
  document.getElementById("estadoUsuario").value = "1";
}

window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.activarUsuario = activarUsuario;
