document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = emailInput.value;
    const contrasena = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Login exitoso!");

        localStorage.setItem("token", data.token); 
        localStorage.setItem("usuario", JSON.stringify(data.usuario)); 

        window.location.href = "../html/main-gest.html";
      } else {
        alert(data.message || "Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar al servidor");
    }
  });
});
