const form = document.getElementById("formulario-solicitud");

if (form) {
  const successBox = document.getElementById("form-success");

  const validators = {
    nombre: (value) => {
      if (!value.trim()) return "El nombre completo es obligatorio.";
      if (value.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
      return "";
    },
    cargo: (value) => {
      if (!value.trim()) return "El cargo es obligatorio.";
      if (value.trim().length < 2) return "El cargo debe tener al menos 2 caracteres.";
      return "";
    },
    empresa: (value) => {
      if (!value.trim()) return "La empresa es obligatoria.";
      if (value.trim().length < 2) return "El nombre de la empresa es demasiado corto.";
      return "";
    },
    sector: (value) => {
      if (!value) return "Selecciona un sector de actividad.";
      return "";
    },
    email: (value) => {
      if (!value.trim()) return "El email corporativo es obligatorio.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(value.trim())) return "Introduce un email valido (ejemplo@empresa.com).";
      return "";
    },
    telefono: (value) => {
      if (!value.trim()) return "El telefono de contacto es obligatorio.";
      const normalized = value.replace(/[\s()-]/g, "");
      const phoneRegex = /^\+?[0-9]{9,15}$/;
      if (!phoneRegex.test(normalized)) return "Introduce un telefono valido, entre 9 y 15 digitos.";
      return "";
    },
    tamano: (value) => {
      if (!value) return "Selecciona el tamano de tu empresa.";
      return "";
    },
    urgencia: (value) => {
      if (!value) return "Selecciona un horizonte de implementacion.";
      return "";
    },
    servicio: (value) => {
      if (!value) return "Selecciona el servicio principal que deseas activar.";
      return "";
    },
    reto: (value) => {
      if (!value.trim()) return "Describe el reto operativo prioritario.";
      if (value.trim().length < 20) return "El reto debe tener al menos 20 caracteres para poder analizarlo.";
      return "";
    },
    objetivo: (value) => {
      if (!value.trim()) return "Indica el objetivo de negocio esperado.";
      if (value.trim().length < 15) return "El objetivo debe tener al menos 15 caracteres.";
      return "";
    },
    acepto: (value, field) => {
      if (!field.checked) return "Debes aceptar el contacto para enviar la solicitud.";
      return "";
    }
  };

  const fieldNames = Object.keys(validators);

  function getField(fieldName) {
    return document.getElementById(fieldName);
  }

  function getErrorNode(fieldName) {
    return document.getElementById(`${fieldName}-error`);
  }

  function setFieldState(field, message) {
    const errorNode = getErrorNode(field.id);
    if (!errorNode) return;

    errorNode.textContent = message;

    if (message) {
      field.classList.add("border-rose-400", "focus:border-rose-400", "focus:ring-rose-300");
      field.classList.remove("border-slate-700", "focus:border-cyan-300", "focus:ring-cyan-300");
      field.setAttribute("aria-invalid", "true");
    } else {
      field.classList.remove("border-rose-400", "focus:border-rose-400", "focus:ring-rose-300");
      field.classList.add("border-slate-700", "focus:border-cyan-300", "focus:ring-cyan-300");
      field.removeAttribute("aria-invalid");
    }
  }

  function validateField(fieldName) {
    const field = getField(fieldName);
    if (!field || !validators[fieldName]) return true;

    const value = field.type === "checkbox" ? String(field.checked) : field.value;
    const message = validators[fieldName](value, field);
    setFieldState(field, message);
    return !message;
  }

  function validateForm() {
    let isValid = true;

    fieldNames.forEach((fieldName) => {
      const validField = validateField(fieldName);
      if (!validField) isValid = false;
    });

    return isValid;
  }

  fieldNames.forEach((fieldName) => {
    const field = getField(fieldName);
    if (!field) return;

    const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";

    field.addEventListener(eventName, () => {
      validateField(fieldName);
      if (successBox) successBox.classList.add("hidden");
    });

    field.addEventListener("blur", () => validateField(fieldName));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      firstInvalid?.focus();
      if (successBox) successBox.classList.add("hidden");
      return;
    }

    if (successBox) {
      successBox.classList.remove("hidden");
      successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    form.reset();

    fieldNames.forEach((fieldName) => {
      const field = getField(fieldName);
      if (!field) return;
      setFieldState(field, "");
    });
  });

  form.addEventListener("reset", () => {
    if (successBox) successBox.classList.add("hidden");

    setTimeout(() => {
      fieldNames.forEach((fieldName) => {
        const field = getField(fieldName);
        if (!field) return;
        setFieldState(field, "");
      });
    }, 0);
  });
}
