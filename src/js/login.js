document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevenir que el formulario recargue la página

    const correo = emailInput.value.trim();  // Limpiar espacios vacíos antes de enviar
    const contrasena = passwordInput.value.trim();  // Limpiar espacios vacíos antes de enviar

    // Verificar que los campos no estén vacíos
    if (!correo || !contrasena) {
      alert("Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      // Manejo de errores basado en la respuesta del backend
      if (response.ok) {
        // Si el login es exitoso
        alert("¡Login exitoso!");

        // Limpiar cualquier dato previo del localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        // Guardamos el token y el usuario en el localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("usuario", JSON.stringify(data.data.usuario));

        // Redirigimos al dashboard o la página principal
        window.location.href = "../html/main-gest.html";
      } else {
        // Si ocurre un error en la respuesta del backend
        alert(data.message || "Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor. Intenta nuevamente.");
    }
  });
});
