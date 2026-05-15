document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("application-form");
  if (!form) return;

  const progressPrimary = document.getElementById("progress-primary");
  const progressSecondary = document.getElementById("progress-secondary");
  const progressFill = document.getElementById("progress-fill");
  const liveRegion = document.getElementById("form-live-region");
  const successScreen = document.getElementById("success-screen");

  const stepPanels = [
    form.querySelector('[data-step-panel="1"]'),
    form.querySelector('[data-step-panel="2"]'),
    form.querySelector('[data-step-panel="3"]'),
  ].filter(Boolean);

  if (stepPanels.length !== 3) return;

  const stepTitles = [
    "Datos personales",
    "Datos de la empresa",
    "Tus necesidades",
  ];

  let currentStep = 1;

  function getField(id) {
    return document.getElementById(id);
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function getErrorNode(field) {
    if (!field) return null;
    const fieldId = field.id;
    if (!fieldId) return null;

    let node = document.getElementById(`${fieldId}-error`);
    if (node) return node;

    node = document.createElement("p");
    node.id = `${fieldId}-error`;
    node.className = "mt-2 text-xs text-error";
    node.setAttribute("role", "alert");
    node.setAttribute("aria-live", "assertive");
    node.style.display = "none";

    field.parentElement?.appendChild(node);
    return node;
  }

  function setError(field, message) {
    if (!field) return;
    const errorNode = getErrorNode(field);

    field.classList.remove("border-emerald-500", "ring-emerald-500/40");
    field.classList.add("border-error", "ring-1", "ring-error/40");
    field.setAttribute("aria-invalid", "true");

    if (errorNode) {
      errorNode.textContent = message;
      errorNode.style.display = "block";
      field.setAttribute("aria-describedby", errorNode.id);
    }
  }

  function clearError(field) {
    if (!field) return;
    const errorNode = getErrorNode(field);

    field.classList.remove("border-error", "ring-error/40");
    field.classList.add("border-emerald-500", "ring-1", "ring-emerald-500/40");
    field.setAttribute("aria-invalid", "false");

    if (errorNode) {
      errorNode.textContent = "";
      errorNode.style.display = "none";
      field.removeAttribute("aria-describedby");
    }
  }

  function setServicesError(message) {
    const servicesError = document.getElementById("services-error");
    const services = form.querySelectorAll('input[name="serviceNeeds"]');
    if (!servicesError) return;

    if (message) {
      servicesError.textContent = message;
      servicesError.classList.remove("hidden");
      services.forEach((service) => service.setAttribute("aria-invalid", "true"));
      if (services[0]) services[0].setAttribute("aria-describedby", "services-error");
      return;
    }

    servicesError.textContent = "";
    servicesError.classList.add("hidden");
    services.forEach((service) => {
      service.setAttribute("aria-invalid", "false");
      service.removeAttribute("aria-describedby");
    });
  }

  function isEmpty(value) {
    return normalizeText(value) === "";
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
  }

  function validPhone(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length >= 7;
  }

  function validSelect(value) {
    return normalizeText(value) !== "";
  }

  function validateStep1() {
    const firstName = getField("first-name");
    const lastName = getField("last-name");
    const corporateEmail = getField("corporate-email");
    const phone = getField("phone");
    const position = getField("position");

    let ok = true;

    if (isEmpty(firstName?.value)) {
      setError(firstName, "Ingresa tu nombre.");
      ok = false;
    } else {
      clearError(firstName);
    }

    if (isEmpty(lastName?.value)) {
      setError(lastName, "Ingresa tus apellidos.");
      ok = false;
    } else {
      clearError(lastName);
    }

    if (!validEmail(corporateEmail?.value || "")) {
      setError(corporateEmail, "Ingresa un email corporativo valido.");
      ok = false;
    } else {
      clearError(corporateEmail);
    }

    if (!validPhone(phone?.value || "")) {
      setError(phone, "Ingresa un telefono valido (minimo 7 digitos).");
      ok = false;
    } else {
      clearError(phone);
    }

    if (!validSelect(position?.value || "")) {
      setError(position, "Selecciona tu cargo.");
      ok = false;
    } else {
      clearError(position);
    }

    return ok;
  }

  function validateStep2() {
    const companyName = getField("company-name");
    const industry = getField("industry");
    const country = getField("country");

    let ok = true;

    if (isEmpty(companyName?.value)) {
      setError(companyName, "Ingresa el nombre de la empresa.");
      ok = false;
    } else {
      clearError(companyName);
    }

    if (!validSelect(industry?.value || "")) {
      setError(industry, "Selecciona un sector.");
      ok = false;
    } else {
      clearError(industry);
    }

    if (!validSelect(country?.value || "")) {
      setError(country, "Selecciona un pais.");
      ok = false;
    } else {
      clearError(country);
    }

    return ok;
  }

  function validateStep3() {
    const services = Array.from(form.querySelectorAll('input[name="serviceNeeds"]'));
    const projectDetails = getField("project-details");
    const checkedServices = services.filter((service) => service.checked).length;

    let ok = true;

    if (checkedServices === 0) {
      setServicesError("Selecciona al menos un servicio.");
      ok = false;
    } else {
      setServicesError("");
    }

    const details = String(projectDetails?.value || "").trim();
    if (details.length < 20) {
      setError(projectDetails, "Describe tu proyecto en al menos 20 caracteres.");
      ok = false;
    } else {
      clearError(projectDetails);
    }

    return ok;
  }

  function validateCurrentStep() {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    return validateStep3();
  }

  function setProgress(step) {
    const pct = Math.round((step / 3) * 100);
    if (progressPrimary) {
      progressPrimary.textContent = `Paso ${step} de 3 - ${stepTitles[step - 1]}`;
    }
    if (progressSecondary) {
      progressSecondary.textContent = `${pct}%`;
    }
    if (progressFill) {
      progressFill.style.width = `${pct}%`;
    }
  }

  function showStep(step) {
    currentStep = step;
    stepPanels.forEach((panel, index) => {
      panel.classList.toggle("hidden", index + 1 !== step);
    });
    setProgress(step);

    if (liveRegion) {
      liveRegion.textContent = `Mostrando ${stepTitles[step - 1]}.`;
    }
  }

  function clearAllErrors() {
    const controls = Array.from(form.querySelectorAll("input, select, textarea"));
    controls.forEach((control) => {
      control.classList.remove("border-error", "ring-error/40", "border-emerald-500", "ring-emerald-500/40", "ring-1");
      control.setAttribute("aria-invalid", "false");
      control.removeAttribute("aria-describedby");
    });

    const messages = form.querySelectorAll('[id$="-error"]');
    messages.forEach((node) => {
      node.textContent = "";
      node.style.display = "none";
    });

    setServicesError("");
  }

  function hideSuccessScreen() {
    if (!successScreen) return;
    successScreen.classList.remove("flex");
    successScreen.classList.add("hidden");
  }

  function showSuccessScreen() {
    if (!successScreen) return;
    successScreen.classList.remove("hidden");
    successScreen.classList.add("flex");
    successScreen.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const step1Next = document.getElementById("step1-next");
  const step2Prev = document.getElementById("step2-prev");
  const step2Next = document.getElementById("step2-next");
  const step3Prev = document.getElementById("step3-prev");

  step1Next?.addEventListener("click", () => {
    if (validateStep1()) showStep(2);
  });

  step2Prev?.addEventListener("click", () => showStep(1));

  step2Next?.addEventListener("click", () => {
    if (validateStep2()) showStep(3);
  });

  step3Prev?.addEventListener("click", () => showStep(2));

  const controls = Array.from(form.querySelectorAll("input, select, textarea"));
  controls.forEach((control) => {
    const type = control.tagName.toLowerCase() === "input" ? control.type : control.tagName.toLowerCase();

    const useInputEvent = ["text", "email", "tel", "textarea"].includes(type);
    if (useInputEvent) {
      control.addEventListener("input", () => {
        if (control.closest(".hidden")) return;
        validateCurrentStep();
      });
    }

    control.addEventListener("blur", () => {
      if (control.closest(".hidden")) return;
      validateCurrentStep();
    });

    control.addEventListener("change", () => {
      if (control.closest(".hidden")) return;
      validateCurrentStep();
    });
  });

  form.addEventListener("reset", () => {
    window.requestAnimationFrame(() => {
      clearAllErrors();
      hideSuccessScreen();
      showStep(1);
      if (liveRegion) {
        liveRegion.textContent = "Formulario reiniciado.";
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const valid = validateStep1() && validateStep2() && validateStep3();
    if (!valid) {
      showStep(1);
      if (!validateStep1()) showStep(1);
      else if (!validateStep2()) showStep(2);
      else showStep(3);

      if (liveRegion) {
        liveRegion.textContent = "Hay errores en el formulario. Revisa los campos marcados.";
      }
      return;
    }

    stepPanels.forEach((panel) => panel.classList.add("hidden"));
    document.querySelector('[role="status"][aria-live="polite"]')?.classList.add("hidden");
    showSuccessScreen();

    if (liveRegion) {
      liveRegion.textContent = "Formulario enviado correctamente.";
    }
  });

  showStep(1);
});
