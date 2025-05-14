// ============================
// FUNCIONES DEL MODAL DE REGISTRO
// ============================

// Función para abrir el formulario de ingreso de código de invitación
function abrirFormularioClase() {
  const modalCodigo = document.getElementById("modalCodigoInvitacion");
  if (modalCodigo) {
    modalCodigo.classList.remove("oculto");
    console.log("✅ Solicitud de código de invitación abierta.");
  } else {
    console.error("❌ No se encontró el modal de código.");
  }
}

// Función para cerrar el modal del código de invitación
function cerrarModalCodigo() {
  const modalCodigo = document.getElementById("modalCodigoInvitacion");
  if (modalCodigo) {
    modalCodigo.classList.add("oculto");
    console.log("✅ Formulario de código cerrado.");
  } else {
    console.error("❌ No se encontró el modal de código.");
  }
}

// Función para abrir el formulario modal de registro de clase
function abrirModalRegistro() {
  const modal = document.getElementById("modalRegistrarClase");
  if (modal) {
    modal.classList.remove("oculto");
    console.log("✅ Formulario de registro abierto.");
  } else {
    console.error("❌ No se encontró el modal de registro.");
  }
}

// Función para cerrar el formulario modal de registro de clase
function cerrarFormularioClase() {
  const modal = document.getElementById("modalRegistrarClase");
  if (modal) {
    modal.classList.add("oculto");
    console.log("✅ Formulario de registro cerrado.");
  } else {
    console.error("❌ No se encontró el modal de registro.");
  }
}

// ============================
// FUNCIONES DE CÓDIGO DE INVITACIÓN
// ============================

// Función para verificar el código de invitación
function verificarCodigo() {
  const codigoIngresado = document.getElementById("codigoInvitacion").value.trim();

  fetch(`${URL}?accion=getCodigo`)
    .then(res => res.text())
    .then(codigoValido => {
      if (codigoIngresado === codigoValido) {
        mostrarToast("✅ Código correcto", "success");
        cerrarModalCodigo();
        abrirModalRegistro();
      } else {
        mostrarToast("❌ Código incorrecto", "error");
      }
    })
    .catch(() => {
      mostrarToast("❌ Error al verificar el código", "error");
    });
}

// ============================
// LOGIN MAESTRO
// ============================
function loginMaestro() {
  const claseInput = document.getElementById("claseMaestro");
  const claveInput = document.getElementById("claveMaestro");

  const clase = claseInput.value.trim();
  const clave = claveInput.value.trim();

  fetch(`${URL}?accion=getClases`)
    .then(res => res.json())
    .then(data => {
      const claseEncontrada = data.find(c => c.ID_CLASE === clase && c.Contraseña === clave);

      if (claseEncontrada) {
        localStorage.setItem("tipo", "maestro");
        localStorage.setItem("clase", clase);
        localStorage.setItem("maestro", claseEncontrada.Maestro);
        window.location.href = "panel-maestro.html";
      } else {
        mostrarToast("❌ Contraseña incorrecta o clase no válida", "error");
        claseInput.value = "";
        claveInput.value = "";
      }
    })
    .catch(() => {
      mostrarToast("❌ Error al conectar con el servidor", "error");
      claseInput.value = "";
      claveInput.value = "";
    });
}

// ============================
// LOGIN ALUMNO
// ============================
function loginAlumno() {
  const claseInput = document.getElementById("claseAlumno");
  const idInput = document.getElementById("alumno");

  const clase = claseInput.value.trim();
  const idAlumno = idInput.value.trim();

  if (!clase || !idAlumno) {
    mostrarToast("⚠ Por favor ingresa tu clase y tu ID de alumno", "error");
    return;
  }

  fetch(`${URL}?accion=getAlumnos&clase=${clase}`)
    .then(res => res.json())
    .then(data => {
      const encontrado = data.find(a => a.ID_ALUMNO.toLowerCase() === idAlumno.toLowerCase());

      if (encontrado) {
        localStorage.setItem("tipo", "alumno");
        localStorage.setItem("clase", clase);
        localStorage.setItem("alumno", encontrado.NombreAlumno);
        localStorage.setItem("id", encontrado.ID_ALUMNO);
        window.location.href = "panel-alumno.html";
      } else {
        mostrarToast("❌ ID de alumno no encontrado en esa clase", "error");
        claseInput.value = "";
        idInput.value = "";
      }
    })
    .catch(() => {
      mostrarToast("❌ Error al conectar con el servidor", "error");
      claseInput.value = "";
      idInput.value = "";
    });
}

// Función para mostrar el mensaje de clase registrada
function mostrarMensajeClase(mensaje) {
  const contenedor = document.getElementById("mensajeExito");
  const modal = document.getElementById("modalMensaje");

  if (contenedor && modal) {
    contenedor.innerHTML = mensaje;  // Utiliza innerHTML para permitir formato en el mensaje
    modal.classList.remove("oculto"); // Muestra el modal
    console.log("✅ Mensaje mostrado en el modal.");
  } else {
    console.error("❌ No se encontró el contenedor o el modal del mensaje.");
  }
}


// Función para copiar el mensaje
function copiarMensaje() {
  const contenido = document.getElementById("mensajeContenido").textContent;
  navigator.clipboard.writeText(contenido).then(() => {
    mostrarToast("📋 Copiado al portapapeles", "success");
  }).catch(() => {
    mostrarToast("❌ No se pudo copiar", "error");
  });
}

// Función para cerrar el mensaje de clase registrada
function cerrarMensajeClase() {
  const contenedor = document.getElementById("mensajeClaseRegistrada");
  if (contenedor) {
    contenedor.classList.add("oculto");
  }
}

function registrarNuevaClase() {
  const nombreCompleto = document.getElementById("nombreCompletoMaestro").value.trim();
  const pais = document.getElementById("paisMaestro").value.trim();

  if (!nombreCompleto || !pais) {
    mostrarToast("⚠ Por favor, complete todos los campos.", "error");
    return;
  }

  const primerNombre = nombreCompleto.split(" ")[0];
  const clave = `${primerNombre}1844`;

  // Enviar datos al servidor para crear la clase usando método POST
  fetch(`${URL}?accion=registrarClase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      accion: "registrarClase",
      nombre: nombreCompleto,
      pais: pais,
      clave: clave
    }).toString()
  })
    .then(res => {
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      return res.text();
    })
    .then(resp => {
      console.log("✅ Respuesta del servidor:", resp);
      if (resp.includes("❌")) {
        mostrarToast(resp, "error");
        return;
      }

      // Ajuste: Evitar duplicidad en el mensaje
      const match = resp.match(/Clase\s*([a-zA-Z0-9]+)/);
      const numeroClase = match ? match[1] : "Desconocido";

      // Crear el mensaje sin duplicar la frase "Clase registrada exitosamente"
      const mensaje = `🆔 ID de Clase: ${numeroClase}<br>🔑Contraseña: ${clave}`;

      // Mostrar el modal con el mensaje
      mostrarMensajeClase(mensaje);

      // Limpiar campos de texto después del registro
      document.getElementById("nombreCompletoMaestro").value = "";
      document.getElementById("paisMaestro").value = "";
      cerrarFormularioClase();
    })
    .catch((error) => {
      console.error("❌ Error al registrar la clase:", error);
      mostrarToast("❌ Error al registrar la clase.", "error");
    });
}


// ============================
// TOAST FLOTANTE
// ============================
function mostrarToast(mensaje, tipo = "info") {
  const contenedor = document.getElementById("toast-container");
  if (!contenedor) return;

  contenedor.innerHTML = ""; 

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = mensaje;
  contenedor.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
