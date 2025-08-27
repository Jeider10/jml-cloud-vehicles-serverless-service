document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Este endpoint lo conectaremos más adelante al micro de autenticación
  fetch("http://localhost:9090/authenticate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(response => {
      if (!response.ok) throw new Error("Acceso denegado");
      return response.json();
    })
    .then(data => {
      alert("Autenticado correctamente. Token: " + data.token);
      // Aquí podrías guardar el token o redirigir
    })
    .catch(error => {
      const errorEl = document.getElementById("error-message");
      errorEl.textContent = error.message;
      errorEl.style.display = "block";
    });
});
