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
        <td><span class="badge ${rol.estado ? 'bg-success' : 'bg-danger'}">
          ${rol.estado ? 'Activo' : 'Inactivo'}
        </span></td>
        <td class="action-btns">
          <button class="btn btn-warning btn-sm" onclick="editarRol(${rol.idRol})"><i class="bi bi-pencil"></i> Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarRol(${rol.idRol})"><i class="bi bi-trash"></i> Eliminar</button>
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

// Función para agregar un nuevo rol
document.getElementById("guardarRolBtn").addEventListener("click", async function (event) {
  event.preventDefault();
  const nombre = document.getElementById("rolNombre").value;

  const nuevoRol = {
    nombre: nombre.trim(),
    estado: false // Siempre insertar como inactivo
  };

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/v1/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(nuevoRol)
    });

    const resultado = await response.json();

    if (response.ok) {
      console.log("Rol insertado correctamente:", resultado);
      cargarRoles();
      const modal = bootstrap.Modal.getInstance(document.getElementById('nuevoRolModal'));
      modal.hide();
    } else {
      alert("Error al insertar: " + resultado?.mensaje || "Error desconocido");
    }
  } catch (error) {
    console.error("Error al insertar nuevo rol:", error);
    alert("Error al insertar nuevo rol");
  }
});

// Función para editar un rol
function editarRol(idRol) {
  console.log("ID recibido para editar:", idRol);

  fetch(`http://localhost:3000/api/v1/roles/${idRol}`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(result => {
    const data = result.data;
    console.log("Datos del rol recibido:", data);

    if (data && data.idRol) {
      document.getElementById("rolId").value = data.idRol;
      document.getElementById("rolNombreEditar").value = data.nombre;
      document.getElementById("rolEstadoEditar").value = data.estado.toString();

      const fechaCreacion = new Date(data.fechaCreacion);
      const fechaFormateada = fechaCreacion.toISOString().split('T')[0];
      document.getElementById("rolFechaEditar").value = fechaFormateada;

      const modal = new bootstrap.Modal(document.getElementById('editarRolModal'));
      modal.show();
    } else {
      console.error("Rol no encontrado.");
    }
  })
  .catch(error => console.error("Error al cargar el rol:", error));
}

// Función para guardar cambios de edición
document.getElementById("guardarRolEditarBtn").addEventListener("click", async function (event) {
  event.preventDefault();

  const id = document.getElementById("rolId").value;
  const nombre = document.getElementById("rolNombreEditar").value;
  const estado = document.getElementById("rolEstadoEditar").value;

  const datosEditados = {
    nombre: nombre.trim(),
    estado: estado === "true"
  };

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/api/v1/roles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(datosEditados)
    });

    const resultado = await response.json();

    if (response.ok) {
      console.log("Rol actualizado correctamente:", resultado);
      cargarRoles();

      const modal = bootstrap.Modal.getInstance(document.getElementById('editarRolModal'));
      modal.hide();

    } else {
      alert("Error al actualizar: " + resultado?.mensaje || "Error desconocido");
    }
  } catch (error) {
    console.error("Error al guardar cambios:", error);
    alert("Error al guardar cambios");
  }
});

function eliminarRol(idRol) {
  if (confirm("¿Estás seguro de eliminar este rol?")) {
    fetch(`http://localhost:3000/api/v1/roles/${idRol}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      cargarRoles();
    })
    .catch(error => console.error("Error al eliminar el rol:", error));
  }
}

document.addEventListener('DOMContentLoaded', cargarRoles);
