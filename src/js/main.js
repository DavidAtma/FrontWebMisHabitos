// PROTEGER el acceso si no hay token
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '../html/login.html';
}

// Mostrar correo del usuario (si quieres)
const usuario = JSON.parse(localStorage.getItem('usuario'));
if (usuario) {
    const perfilElem = document.querySelector('.perfil h5');
    if (perfilElem) {
        perfilElem.textContent = usuario.correo;
    }
}

function cargarModulo(modulo) {
  const moduloDiv = document.getElementById("modulo");

  fetch(`../content/${modulo}.html`)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar el módulo");
      return res.text();
    })
    .then(html => {
      moduloDiv.innerHTML = html;

      // Eliminar cualquier script anterior
      const oldScript = document.getElementById("scriptModulo");
      if (oldScript) oldScript.remove();

      // Cargar el script asociado dinámicamente
      const script = document.createElement("script");
      script.type = "module";
      script.id = "scriptModulo";
      script.src = `../js/${modulo}.js`;
      document.body.appendChild(script);
    })
    .catch(err => {
      console.error("Error al cargar módulo:", err);
      moduloDiv.innerHTML = `<p>Error al cargar el módulo.</p>`;
    });
}



function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}
