document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../html/login.html';
    return;
  }

  const usuarioString = localStorage.getItem('usuario');
  let usuario = null;
  if (usuarioString) {
    try {
      usuario = JSON.parse(usuarioString);
    } catch (error) {
      console.error("Error al parsear el usuario:", error);
      usuario = {};
    }
  }

  if (usuario && usuario.correo) {
    const perfilElem = document.querySelector('.perfil h5');
    if (perfilElem) {
      perfilElem.textContent = usuario.correo;
    }
  }

  async function cargarRoles() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/roles", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success && data.data) {
        const tablaBody = document.getElementById("tablaRolesBody");
        tablaBody.innerHTML = '';

        data.data.forEach(rol => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${rol.idRol}</td>
            <td>${rol.nombre}</td>
            <td>${new Date(rol.fechaCreacion).toLocaleDateString()}</td>
            <td>${rol.estado ? 'Activo' : 'Inactivo'}</td>
          `;
          tablaBody.appendChild(row);
        });
      } else {
        console.error("No se pudieron cargar los roles");
      }
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  }

  cargarRoles();
});
