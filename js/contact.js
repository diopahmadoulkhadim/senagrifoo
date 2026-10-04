/* ============================================================
   SEN-AGRI-FOOD — Formulaire de contact
   Le message s'ouvre dans WhatsApp, vers le numéro de la gérante.
   ============================================================ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECT_LABELS = {
    commande: 'Question sur une commande',
    produit: 'Information sur un produit',
    livraison: 'Question sur la livraison',
    partenariat: 'Proposition de partenariat',
    autre: 'Autre'
};

function setFieldState(field, valid) {
    field.classList.toggle('is-invalid', !valid);
    field.classList.toggle('is-valid', valid);
}

function validateContactField(field) {
    const value = field.value.trim();
    let valid = true;
    if (field.id === 'contactName') valid = value.length >= 3;
    else if (field.id === 'contactEmail') valid = value === '' || EMAIL_PATTERN.test(value);
    else if (field.id === 'contactSubject') valid = value !== '';
    else if (field.id === 'contactMessage') valid = value.length >= 10;
    setFieldState(field, valid);
    return valid;
}

function initContact() {
    const form = document.getElementById('contactForm');
    const message = document.getElementById('contactMessage');
    const counter = document.getElementById('charCount');
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));

    message.addEventListener('input', () => { counter.textContent = message.value.length; });
    fields.forEach(field => {
        field.addEventListener('blur', () => validateContactField(field));
        field.addEventListener('input', () => { if (field.classList.contains('is-invalid')) validateContactField(field); });
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const allValid = fields.map(validateContactField).every(Boolean);
        if (!allValid) {
            showNotification('Veuillez remplir tous les champs correctement', 'error');
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        sendContactMessage(form, fields);
    });
}

function sendContactMessage(form, fields) {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const text = document.getElementById('contactMessage').value.trim();
    const message = [
        'Bonjour, je vous écris depuis le site Sen-Agri-Food.',
        '',
        `Sujet : ${SUBJECT_LABELS[subject] || subject}`,
        `Nom : ${name}`,
        ...(email ? [`E-mail : ${email}`] : []),
        '',
        text
    ].join('\n');

    openWhatsApp(message);                       // directement dans le clic (sinon bloqué)
    document.getElementById('contactWhatsappLink').href = whatsappUrl(message);
    form.reset();
    fields.forEach(f => f.classList.remove('is-valid', 'is-invalid'));
    document.getElementById('charCount').textContent = '0';
    showContactConfirmation(name);
}

function showContactConfirmation(name) {
    const box = document.getElementById('contactSuccess');
    box.querySelector('[data-name]').textContent = name;
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

onPage('contact', initContact);
