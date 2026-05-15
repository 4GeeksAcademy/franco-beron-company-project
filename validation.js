document.addEventListener('DOMContentLoaded', () => {
  const sectionRoot = document.querySelector('main section .mx-auto.max-w-2xl');
  if (!sectionRoot) return;

  const allBlocks = Array.from(sectionRoot.querySelectorAll(':scope > div'));
  const step1 = allBlocks.find(block => block.querySelector('h2')?.textContent?.includes('Datos personales'));
  const step2 = allBlocks.find(block => block.querySelector('h2')?.textContent?.includes('Datos de la empresa'));
  const step3 = allBlocks.find(block => block.querySelector('h2')?.textContent?.includes('Tus necesidades'));

  if (!step1 || !step2 || !step3) return;

  const progressWrap = sectionRoot.querySelector(':scope > div.mb-12');
  const progressTextPrimary = progressWrap?.querySelector('div > span:first-child');
  const progressTextSecondary = progressWrap?.querySelector('div > span:last-child');
  const progressFill = progressWrap?.querySelector('.h-px.w-full > div');

  const steps = [step1, step2, step3];
  const stepTitles = ['Datos personales', 'Datos de la empresa', 'Tus necesidades'];

  let currentStep = 1;

  function setProgress(step) {
    const pct = Math.round((step / 3) * 100);
    if (progressTextPrimary) {
      progressTextPrimary.textContent = `Paso ${step} de 3 - ${stepTitles[step - 1]}`;
    }
    if (progressTextSecondary) {
      progressTextSecondary.textContent = `${pct}%`;
    }
    if (progressFill) {
      progressFill.classList.remove('w-1/3', 'w-2/3', 'w-full');
      if (step === 1) progressFill.classList.add('w-1/3');
      if (step === 2) progressFill.classList.add('w-2/3');
      if (step === 3) progressFill.classList.add('w-full');
    }
  }

  function showStep(step) {
    currentStep = step;
    steps.forEach((block, index) => {
      const isActive = index + 1 === step;
      block.classList.toggle('hidden', !isActive);
    });
    setProgress(step);
  }

  function getControlByLabel(root, labelText) {
    const normalizeText = (value) =>
      String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const labels = Array.from(root.querySelectorAll('label'));
    const normalizedNeedle = normalizeText(labelText);
    const label = labels.find((item) =>
      normalizeText(item.textContent).includes(normalizedNeedle)
    );
    if (!label) return null;
    const control = label.parentElement?.querySelector('input, select, textarea');
    return control || null;
  }

  function getErrorNode(control) {
    if (!control) return null;
    const holder = control.parentElement;
    if (!holder) return null;
    const existing = holder.querySelector('.validation-error');
    if (existing) return existing;
    const node = document.createElement('p');
    node.className = 'validation-error mt-2 text-xs text-error';
    node.style.display = 'none';
    holder.appendChild(node);
    return node;
  }

  function setError(control, message) {
    if (!control) return;
    control.classList.add('border-error', 'ring-1', 'ring-error/40');
    control.classList.remove('border-emerald-500', 'ring-emerald-500/40');
    const errorNode = getErrorNode(control);
    if (errorNode) {
      errorNode.textContent = message;
      errorNode.style.display = 'block';
    }
  }

  function clearError(control) {
    if (!control) return;
    control.classList.remove('border-error', 'ring-error/40');
    control.classList.add('border-emerald-500', 'ring-1', 'ring-emerald-500/40');
    const errorNode = getErrorNode(control);
    if (errorNode) {
      errorNode.textContent = '';
      errorNode.style.display = 'none';
    }
  }

  function isEmpty(value) {
    return String(value || '').trim() === '';
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validPhone(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length >= 7;
  }

  function validSelect(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === '') return false;
    return !normalized.includes('seleccionar');
  }

  function validateStep1() {
    const nombre = getControlByLabel(step1, 'Nombre');
    const apellidos = getControlByLabel(step1, 'Apellidos');
    const email = getControlByLabel(step1, 'Email corporativo');
    const telefono = getControlByLabel(step1, 'Telefono');
    const cargo = getControlByLabel(step1, 'Cargo');

    let ok = true;

    if (isEmpty(nombre?.value)) {
      setError(nombre, 'Ingresa tu nombre');
      ok = false;
    } else {
      clearError(nombre);
    }

    if (isEmpty(apellidos?.value)) {
      setError(apellidos, 'Ingresa tus apellidos');
      ok = false;
    } else {
      clearError(apellidos);
    }

    if (!validEmail(email?.value || '')) {
      setError(email, 'Ingresa un email valido');
      ok = false;
    } else {
      clearError(email);
    }

    if (!validPhone(telefono?.value || '')) {
      setError(telefono, 'Ingresa un telefono valido (minimo 7 digitos)');
      ok = false;
    } else {
      clearError(telefono);
    }

    if (!validSelect(cargo?.value || '')) {
      setError(cargo, 'Selecciona tu cargo');
      ok = false;
    } else {
      clearError(cargo);
    }

    return ok;
  }

  function validateStep2() {
    const empresa = getControlByLabel(step2, 'Nombre de la empresa');
    const sector = getControlByLabel(step2, 'Sector');
    const pais = getControlByLabel(step2, 'Pais');

    let ok = true;

    if (isEmpty(empresa?.value)) {
      setError(empresa, 'Ingresa el nombre de la empresa');
      ok = false;
    } else {
      clearError(empresa);
    }

    if (!validSelect(sector?.value || '')) {
      setError(sector, 'Selecciona un sector valido');
      ok = false;
    } else {
      clearError(sector);
    }

    if (!validSelect(pais?.value || '')) {
      setError(pais, 'Selecciona un pais valido');
      ok = false;
    } else {
      clearError(pais);
    }

    return ok;
  }

  function validateStep3() {
    const checks = Array.from(step3.querySelectorAll('input[type="checkbox"]'));
    const checked = checks.filter(item => item.checked).length;
    const textarea = step3.querySelector('textarea');

    let ok = true;

    const checksGrid = step3.querySelector('.grid');
    let checksError = step3.querySelector('.validation-error-checks');
    if (!checksError && checksGrid) {
      checksError = document.createElement('p');
      checksError.className = 'validation-error-checks mt-2 text-xs text-error';
      checksGrid.parentElement.appendChild(checksError);
    }

    if (checked === 0) {
      if (checksError) {
        checksError.textContent = 'Selecciona al menos un servicio';
        checksError.style.display = 'block';
      }
      ok = false;
    } else if (checksError) {
      checksError.textContent = '';
      checksError.style.display = 'none';
    }

    if (isEmpty(textarea?.value) || (textarea?.value || '').trim().length < 20) {
      setError(textarea, 'Describe tu proyecto en al menos 20 caracteres');
      ok = false;
    } else {
      clearError(textarea);
    }

    return ok;
  }

  function attachRealtimeValidation() {
    const controls = Array.from(sectionRoot.querySelectorAll('input, select, textarea'));
    controls.forEach(control => {
      const eventName = control.tagName.toLowerCase() === 'select' || control.type === 'checkbox' ? 'change' : 'blur';
      control.addEventListener(eventName, () => {
        if (control.closest('.hidden')) return;
        if (currentStep === 1) validateStep1();
        if (currentStep === 2) validateStep2();
        if (currentStep === 3) validateStep3();
      });
    });
  }

  function createStep2Nav() {
    const nav = document.createElement('div');
    nav.className = 'mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-amber/20 pt-8';

    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'border border-amber/20 px-6 py-4 text-sm tracking-[0.04em] text-mist transition hover:border-mist hover:text-paper';
    backButton.textContent = '<- Anterior';

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'bg-amber px-8 py-4 text-sm font-medium tracking-[0.06em] text-black transition hover:bg-amber-light';
    nextButton.textContent = 'Continuar ->';

    nav.appendChild(backButton);
    nav.appendChild(nextButton);
    step2.appendChild(nav);

    backButton.addEventListener('click', () => showStep(1));
    nextButton.addEventListener('click', () => {
      if (validateStep2()) showStep(3);
    });
  }

  function createSuccessScreen() {
    const success = document.createElement('div');
    success.className = 'hidden items-center justify-center border-t border-amber/20 pt-12';
    success.innerHTML = `
      <div class="w-full rounded border border-amber/25 bg-black/30 p-8 text-center">
        <p class="text-amber text-sm tracking-[0.14em] uppercase">Solicitud enviada</p>
        <h3 class="mt-3 font-serif text-4xl font-light">Gracias por contactarnos</h3>
        <p class="mt-4 text-sm leading-7 text-mist">Un consultor de Nexova se pondra en contacto contigo en menos de 48 horas.</p>
      </div>
    `;
    sectionRoot.appendChild(success);
    return success;
  }

  const successScreen = createSuccessScreen();

  const step1Continue = step1.querySelector('form button[type="button"]');
  if (step1Continue) {
    step1Continue.addEventListener('click', () => {
      if (validateStep1()) showStep(2);
    });
  }

  createStep2Nav();

  const step3Back = Array.from(step3.querySelectorAll('button[type="button"]')).find(btn => btn.textContent.includes('Anterior'));
  const step3Submit = step3.querySelector('button[type="submit"]');

  step3Back?.addEventListener('click', () => showStep(2));

  step3Submit?.addEventListener('click', event => {
    event.preventDefault();
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();
    const step3Valid = validateStep3();

    if (step1Valid && step2Valid && step3Valid) {
      steps.forEach(step => step.classList.add('hidden'));
      progressWrap?.classList.add('hidden');
      successScreen.classList.remove('hidden');
      successScreen.classList.add('flex');
      successScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  showStep(1);
  attachRealtimeValidation();
});
