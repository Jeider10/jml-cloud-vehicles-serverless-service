let sessionToken = "";

export function iniciarSesion() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userName: user, password: pass })
    })
    .then(res => {
        if (!res.ok) throw new Error("Login inválido");
        return res.json();
    })
    .then(result => {
        sessionToken = result.authorization;
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("opciones").classList.remove("hidden");

        llenarSelect("subsidiary", result.options.subsidiaries, "subsidiaryCode", "subsidiaryName");
        llenarSelect("branch", result.options.branches, "branchCode", "branchName");
        llenarSelect("role", result.options.roles, "rolCode", "rolName");
    })
    .catch(err => {
        document.getElementById("error").innerText = "Usuario o contraseña incorrectos.";
    });
}

export function confirmarSeleccion() {
    const username = document.getElementById("username").value;
    const subsidiarySelect = document.getElementById("subsidiary");
    const branchSelect = document.getElementById("branch");
    const roleSelect = document.getElementById("role");

    const body = {
        sessionToken,
        authentication: { authenticationUserLogin: username },
        subsidiaryCodeSelection: {
            subsidiaryCodeDto: parseInt(subsidiarySelect.value),
            subsidiaryNameDto: subsidiarySelect.options[subsidiarySelect.selectedIndex].text
        },
        branchCodeSelection: {
            branchCodeDto: parseInt(branchSelect.value),
            branchNameDto: branchSelect.options[branchSelect.selectedIndex].text
        },
        rolCodeSelection: {
            rolCodeDto: parseInt(roleSelect.value),
            rolNameDto: roleSelect.options[roleSelect.selectedIndex].text
        }
    };

    fetch("/auth/login/role-selection", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (!res.ok) throw new Error("Confirmación fallida");
        return res.json();
    })
    .then(() => {
        localStorage.setItem("token", sessionToken);
        window.location.href = "home.html";
    })
    .catch(err => {
        alert("❌ Error al confirmar: " + err.message);
    });
}

function llenarSelect(id, items, codeField, nameField) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item[codeField];
        option.textContent = item[nameField];
        select.appendChild(option);
    });
}
