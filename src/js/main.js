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

// Función para cargar módulos
async function cargarModulo(modulo) {
  const moduloDiv = document.getElementById('modulo');
  if (!moduloDiv) return;

  try {
    // Mostrar estado de carga
    moduloDiv.innerHTML = ` 
      <div class="module-container">
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    `;

    // Cargar HTML del módulo
    const response = await fetch(`../content/${modulo}.html`);
    if (!response.ok) throw new Error("Módulo no encontrado");
    
    const html = await response.text();
    moduloDiv.innerHTML = html;

    // Cargar JS del módulo de forma dinámica y evitar duplicación de scripts
    const existingScript = document.getElementById(`${modulo}-script`);
    if (existingScript) existingScript.remove();  // Eliminar script existente

    const script = document.createElement('script');
    script.id = `${modulo}-script`;
    script.src = `../js/${modulo}.js`;
    
    // Manejar errores del script
    script.onerror = () => {
      moduloDiv.innerHTML = ` 
        <div class="module-container">
          <div class="alert alert-danger">
            Error al cargar el módulo ${modulo}.
          </div>
        </div>
      `;
    };
    
    document.body.appendChild(script);  // Agregar el script dinámicamente

  } catch (error) {
    console.error(`Error al cargar módulo ${modulo}:`, error);
    moduloDiv.innerHTML = ` 
      <div class="module-container">
        <div class="alert alert-danger">
          Error: ${error.message}
        </div>
      </div>
    `;
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '../html/login.html';
}

// Inicialización
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
      const modulo = btn.dataset.module; // Obtener el módulo a cargar
      cargarModulo(modulo); // Cargar el módulo correspondiente
    });
  });

  // Configurar botón de cierre de sesión
  document.getElementById('logoutBtn').addEventListener('click', cerrarSesion);

  // Cargar módulo inicial si hay hash en la URL (por ejemplo, '#roles')
  const moduloInicial = window.location.hash.substring(1);
  if (moduloInicial) {
    cargarModulo(moduloInicial);
  }
});
