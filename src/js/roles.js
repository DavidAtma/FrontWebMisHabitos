document.addEventListener("DOMContentLoaded", () => {
  console.log("roles.js cargado ✅");
  cargarRoles();
});

async function cargarRoles() {
  const token = localStorage.getItem("token");
  const tablaBody = document.getElementById("tablaRolesBody");
  tablaBody.innerHTML = "";

  try {
    const response = await fetch("http://localhost:3000/api/v1/roles", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const json = await response.json();
    console.log("Respuesta del backend:", json); // 👈 Verifica si llega la data

    if (!json.success) {
      throw new Error(json.message || "No se pudo obtener roles");
    }

    json.data.forEach((rol) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${rol.id_rol}</td>
        <td>${rol.nombre}</td>
        <td>${rol.fecha_creacion?.split("T")[0]}</td>
        <td>
          <span class="badge ${rol.estado ? 'bg-success' : 'bg-danger'}">
            ${rol.estado ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td>
          <button class="btn btn-warning btn-sm">Editar</button>
          <button class="btn btn-danger btn-sm">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });

  } catch (error) {
    console.error("Error al cargar roles:", error);
    const filaError = document.createElement("tr");
    filaError.innerHTML = `<td colspan="5" class="text-danger">Error al cargar los datos.</td>`;
    tablaBody.appendChild(filaError);
  }
}
