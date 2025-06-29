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

// Función para cargar los módulos dinámicamente
function cargarModulo(nombre) {
    const ruta = `../content/${nombre}.html`;
    fetch(ruta)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const moduloElem = document.getElementById('modulo');
            if (moduloElem) {
                moduloElem.innerHTML = data;
            } else {
                console.error("Elemento con id 'modulo' no encontrado.");
            }
        })
        .catch(error => {
            const moduloElem = document.getElementById('modulo');
            if (moduloElem) {
                moduloElem.innerHTML = "<p>Error al cargar el módulo.</p>";
            }
            console.error("Error al cargar módulo:", error);
        });
}

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}
