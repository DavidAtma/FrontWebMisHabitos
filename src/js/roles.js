async function cargarRoles() {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autenticado');

    const tablaBody = document.getElementById('tablaRolesBody');
    if (!tablaBody) throw new Error('Tabla no encontrada');

    tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando roles...</td></tr>';

    const response = await fetch('http://localhost:3000/api/v1/roles', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error al cargar roles');
    }

    const { data } = await response.json();
    tablaBody.innerHTML = '';

    data.forEach(rol => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${rol.idRol}</td>
        <td>${rol.nombre}</td>
        <td>${new Date(rol.fechaCreacion).toLocaleDateString()}</td>
        <td>
          <span class="badge ${rol.estado ? 'bg-success' : 'bg-danger'}">
            ${rol.estado ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td class="action-btns">
          ${
            rol.estado
              ? `
                <button class="btn btn-warning btn-sm" onclick="editarRol(${rol.idRol})">
                  <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarRol(${rol.idRol})">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              `
              : `
                <button class="btn btn-success btn-sm" onclick="activarRol(${rol.idRol})">
                  <i class="bi bi-check-circle"></i> Activar
                </button>
              `
          }
        </td>
      `;
      tablaBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar roles:', error);
    const tablaBody = document.getElementById('tablaRolesBody');
    if (tablaBody) {
      tablaBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-danger">
            ${error.message}
          </td>
        </tr>
      `;
    }

    if (error.message.includes('token') || error.message.includes('401')) {
      cerrarSesion();
    }
  }
}

document.getElementById("guardarRolBtn").addEventListener("click", async () => {
  const nombre = document.getElementById("rolNombre").value.trim();
  const estado = document.getElementById("rolEstado").value === "true";

  const token = localStorage.getItem("token");
  if (!token || !nombre) return alert("Completa todos los campos.");

  try {
    const res = await fetch("http://localhost:3000/api/v1/roles", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre, estado })
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById("formNuevoRol").reset();
      bootstrap.Modal.getInstance(document.getElementById("nuevoRolModal")).hide();
      cargarRoles();
    } else {
      alert(data.message || "No se pudo crear el rol.");
    }
  } catch (error) {
    console.error("Error al crear rol:", error);
    alert("Error al crear rol.");
  }
});

// Editar rol (abrir modal con datos)
function editarRol(idRol) {
  fetch(`http://localhost:3000/api/v1/roles/${idRol}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(({ data }) => {
      document.getElementById("rolId").value = data.idRol;
      document.getElementById("rolNombreEditar").value = data.nombre;
      document.getElementById("rolEstadoEditar").value = data.estado;
      document.getElementById("rolFechaEditar").value = data.fechaCreacion.split("T")[0];

      const modal = new bootstrap.Modal(document.getElementById("editarRolModal"));
      modal.show();
    })
    .catch(err => {
      console.error("Error al cargar rol para editar:", err);
      alert("No se pudo cargar el rol.");
    });
}

// Guardar cambios del rol editado
document.getElementById("guardarRolEditarBtn").addEventListener("click", async () => {
  const id = document.getElementById("rolId").value;
  const nombre = document.getElementById("rolNombreEditar").value;

  try {
    const res = await fetch(`http://localhost:3000/api/v1/roles/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre })
    });

    const data = await res.json();
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById("editarRolModal")).hide();
      cargarRoles();
    } else {
      alert(data.message || "No se pudo actualizar el rol.");
    }
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    alert("Error al actualizar.");
  }
});

// Eliminar rol
function eliminarRol(idRol) {
  if (!confirm("¿Deseas eliminar este rol?")) return;

  fetch(`http://localhost:3000/api/v1/roles/${idRol}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        cargarRoles();
      } else {
        alert("No se pudo eliminar el rol.");
      }
    })
    .catch(error => {
      console.error("Error al eliminar rol:", error);
      alert("Error al eliminar.");
    });
}

function activarRol(idRol) {
  if (!confirm("¿Deseas activar este rol?")) return;

  const token = localStorage.getItem("token");

  fetch(`http://localhost:3000/api/v1/roles/${idRol}`, {
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
        cargarRoles();
      } else {
        alert("No se pudo activar el rol.");
      }
    })
    .catch(error => {
      console.error("Error al activar el rol:", error);
      alert("Error al activar rol");
    });
}

// ✅ Ejecutar automáticamente al cargar el archivo
cargarRoles();
