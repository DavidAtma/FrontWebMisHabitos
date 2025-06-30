const usuarioString = localStorage.getItem('usuario');

let usuario = null;
if (usuarioString) {
  try {
    usuario = JSON.parse(usuarioString); // Intentar parsear el JSON
  } catch (error) {
    console.error("Error al parsear el usuario:", error);
    // Aquí puedes asignar un valor predeterminado o manejar el error como desees
    usuario = {}; // Asignar un objeto vacío o manejar el error de otra forma
  }
} else {
  console.warn("No se encontró el objeto 'usuario' en localStorage.");
}

if (usuario && usuario.correo) {
  const perfilElem = document.querySelector('.perfil h5');
  if (perfilElem) {
    perfilElem.textContent = usuario.correo;  // Mostrar el correo si el usuario existe
  }
} else {
  console.error("El usuario no está definido o tiene valores inválidos.");
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
