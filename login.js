// Login Maestro (ahora obtiene también el nombre del maestro)
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
        localStorage.setItem("maestro", claseEncontrada.Maestro); // ✅ Guarda el nombre real
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

// Login Alumno usando ID_ALUMNO (más seguro)
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
        localStorage.setItem("alumno", encontrado.NombreAlumno); // Muestra el nombre correcto después
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

// ============================
// REGISTRAR NUEVA CLASE
// ============================
function registrarNuevaClase() {
  const nombreCompleto = document.getElementById("nombreCompletoMaestro").value.trim();
  const pais = document.getElementById("paisMaestro").value.trim();

  if (!nombreCompleto || !pais) {
    mostrarToast("⚠ Por favor, complete todos los campos.", "error");
    return;
  }

  const primerNombre = nombreCompleto.split(" ")[0];
  const clave = `${primerNombre}1844`;

  console.log("📝 Datos enviados:", { nombreCompleto, pais, clave });

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
      console.log("📝 Estado de la respuesta:", res.status, res.statusText);
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      return res.text();
    })
    .then(resp => {
      console.log("✅ Respuesta del servidor:", resp);
      if (resp.includes("❌")) {
        mostrarToast(resp, "error");
        return;
      }
      mostrarToast("✅ Clase registrada correctamente", "success");

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




// ✅ Toast flotante único
function mostrarToast(mensaje, tipo = "info") {
  const contenedor = document.getElementById("toast-container");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // Limpiar notificaciones anteriores

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = mensaje;
  contenedor.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

