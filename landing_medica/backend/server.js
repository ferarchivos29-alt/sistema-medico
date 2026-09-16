// URL oficial de tu Backend en Render
const BACKEND_URL = "https://sistema-medico-245.onrender.com";

function mostrarSeccion(seccion) {
    document.getElementById('sec-home').style.display = 'none';
    document.getElementById('sec-portal').style.display = 'none';
    document.getElementById('sec-login').style.display = 'none';
    document.getElementById('sec-admin').style.display = 'none';

    if(seccion === 'home') document.getElementById('sec-home').style.display = 'block';
    if(seccion === 'portal') document.getElementById('sec-portal').style.display = 'block';
    if(seccion === 'login') document.getElementById('sec-login').style.display = 'block';
    if(seccion === 'admin') document.getElementById('sec-admin').style.display = 'block';
}

// 1. Buscar examen en el Backend
function buscarExamen() {
    const dni = document.getElementById('inputDni').value.trim();
    const exitoDiv = document.getElementById('resultadoExito');
    const errorDiv = document.getElementById('resultadoError');
    const link = document.getElementById('linkDescarga');

    exitoDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    if (dni.length !== 7) {
        errorDiv.innerText = '⚠️ El DNI debe tener exactamente 7 dígitos.';
        errorDiv.style.display = 'block';
        return;
    }

    fetch(`${BACKEND_URL}/api/buscar/${dni}`)
        .then(res => res.json())
        .then(data => {
            if (data.encontrado) {
                link.href = data.url;
                exitoDiv.style.display = 'block';
            } else {
                errorDiv.innerText = '❌ ' + (data.mensaje || 'No se encontraron resultados.');
                errorDiv.style.display = 'block';
            }
        })
        .catch(() => {
            errorDiv.innerText = '❌ Error de conexión con el servidor backend.';
            errorDiv.style.display = 'block';
        });
}

// 2. Login de Administrador
function loginAdmin() {
    const usuario = document.getElementById('userAdmin').value;
    const password = document.getElementById('passAdmin').value;
    const err = document.getElementById('loginError');

    fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            err.style.display = 'none';
            document.getElementById('userAdmin').value = '';
            document.getElementById('passAdmin').value = '';
            mostrarSeccion('admin');
        } else {
            err.innerText = 'Credenciales incorrectas (admin / 123456)';
            err.style.display = 'block';
        }
    })
    .catch(() => {
        err.innerText = 'Error al conectar con el servidor.';
        err.style.display = 'block';
    });
}

// 3. Subir Examen al Backend
function subirExamen() {
    const dni = document.getElementById('subDni').value.trim();
    const fileInput = document.getElementById('subArchivo');
    const msg = document.getElementById('subMensaje');

    if (dni.length !== 7 || fileInput.files.length === 0) {
        msg.className = 'alert alert-danger';
        msg.innerText = '⚠️ Ingrese un DNI de 7 dígitos y seleccione un archivo.';
        msg.style.display = 'block';
        return;
    }

    const formData = new FormData();
    formData.append('dni', dni);
    formData.append('examen', fileInput.files[0]);

    msg.className = 'alert alert-info';
    msg.innerText = '⏳ Subiendo archivo al servidor...';
    msg.style.display = 'block';

    fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.mensaje) {
            msg.className = 'alert alert-success';
            msg.innerText = '✅ ' + data.mensaje;
            document.getElementById('subDni').value = '';
            fileInput.value = '';
        } else {
            msg.className = 'alert alert-danger';
            msg.innerText = '⚠️ ' + (data.error || 'Error al subir el archivo.');
        }
    })
    .catch(() => {
        msg.className = 'alert alert-danger';
        msg.innerText = '❌ Error de red al intentar subir el examen.';
    });
}
