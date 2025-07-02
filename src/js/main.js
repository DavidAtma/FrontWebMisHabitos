// Función para mostrar información del usuario
function mostrarUsuario() {
  const usuarioString = localStorage.getItem('usuario');
  if (!usuarioString) return;

  try {
    const usuario = JSON.parse(usuarioString);
    const userEmailElem = document.getElementById('userEmail');
    if (userEmailElem && usuario.correo) {
      userEmailElem.textContent = usuario.correo;
    }
  } catch (error) {
    console.error("Error al mostrar usuario:", error);
  }
}

// Función para cargar módulos dinámicamente
async function cargarModulo(modulo) {
  const moduloDiv = document.getElementById('modulo');
  if (!moduloDiv) return;

  // Mostrar spinner de carga
  moduloDiv.innerHTML = `
    <div class="module-container">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  `;

  try {
   if (modulo === "dashboard") {
  const moduloDiv = document.getElementById("modulo");
  const template = document.getElementById("dashboard-template");
  if (!template || !moduloDiv) throw new Error("Contenido de dashboard no encontrado");

  moduloDiv.innerHTML = "";
  moduloDiv.appendChild(template.content.cloneNode(true));

  if (typeof cargarResumenDashboard === "function") {
    cargarResumenDashboard();
  }
  return;
}

    // Cargar HTML del resto de módulos
    const response = await fetch(`../content/${modulo}.html`);
    if (!response.ok) throw new Error("Módulo no encontrado");

    const html = await response.text();
    moduloDiv.innerHTML = html;

    // Eliminar script anterior si existe
    const existingScript = document.getElementById(`${modulo}-script`);
    if (existingScript) existingScript.remove();

    // Cargar script del módulo
    const script = document.createElement("script");
    script.id = `${modulo}-script`;
    script.src = `../js/${modulo}.js`;
    script.onerror = () => {
      moduloDiv.innerHTML = `<div class="alert alert-danger">Error cargando módulo ${modulo}</div>`;
    };
    document.body.appendChild(script);

  } catch (error) {
    console.error(`Error al cargar módulo ${modulo}:`, error);
    moduloDiv.innerHTML = `
      <div class="alert alert-danger">Error: ${error.message}</div>
    `;
  }
}



// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '../html/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../html/login.html';
    return;
  }

  // Mostrar información del usuario
  mostrarUsuario();

  // Configurar eventos para cargar módulos desde los botones
  document.querySelectorAll('.module-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modulo = btn.dataset.module;
      window.location.hash = modulo; // actualiza el hash manualmente
      cargarModulo(modulo);
    });
  });

  // Configurar botón de cierre de sesión
  document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);

  // Obtener el módulo desde el hash o usar "dashboard" por defecto
  const moduloInicial = window.location.hash.substring(1) || "dashboard";
  cargarModulo(moduloInicial); // Cargar el módulo
});




async function cargarResumenDashboard() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/api/v1/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { data } = await response.json();

    // Total de usuarios
    document.getElementById("totalUsuarios").textContent = data.length;

    // Usuarios activos e inactivos
    const activos = data.filter(u => u.estado).length;
    const inactivos = data.length - activos;
    document.getElementById("usuariosActivos").textContent = activos;
    document.getElementById("usuariosInactivos").textContent = inactivos;

    // Usuarios por rol
    const conteoPorRol = {};
    data.forEach(u => {
      const rol = u.rol?.nombre || "Sin Rol";
      conteoPorRol[rol] = (conteoPorRol[rol] || 0) + 1;
    });

    const ul = document.getElementById("usuariosPorRol");
    ul.innerHTML = "";
    for (const rol in conteoPorRol) {
      ul.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${rol}
          <span class="badge bg-primary rounded-pill">${conteoPorRol[rol]}</span>
        </li>`;
    }

  } catch (error) {
    console.error("Error al cargar resumen del dashboard:", error);
  }
}

window.addEventListener("DOMContentLoaded", cargarResumenDashboard);
