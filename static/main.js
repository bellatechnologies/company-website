// Mobile menu
const toggle = document.getElementById('menu-toggle');
const menu   = document.getElementById('mobile-menu');
toggle.addEventListener('click', () => menu.classList.toggle('hidden'));
menu.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => menu.classList.add('hidden'))
);

// Form submit
const ORIGINAL_BTN_HTML = document.getElementById('submit-btn').innerHTML;

document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form  = e.target;
  const btn   = document.getElementById('submit-btn');
  const msgEl = document.getElementById('form-message');

  const data = {
    fullName:  form.fullName.value.trim(),
    phone:     form.phone.value.trim(),
    email:     form.email.value.trim(),
    company:   form.company.value.trim(),
    turnover:  form.turnover.value,
    challenge: form.challenge.value.trim(),
  };

  btn.disabled = true;
  btn.innerHTML = '<svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Sending…';
  msgEl.className = 'text-center text-sm hidden';
  msgEl.textContent = '';

  function resetBtn() {
    btn.disabled = false;
    btn.innerHTML = ORIGINAL_BTN_HTML;
    lucide.createIcons();
  }

  try {
    const res  = await fetch('/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    const json = await res.json();

    if (res.ok && json.ok) {
      btn.innerHTML = '✓ Submitted — we\'ll be in touch shortly!';
      btn.classList.remove('bg-orange-500', 'hover:bg-orange-600');
      btn.classList.add('bg-teal-500', 'cursor-default');
      msgEl.textContent = json.message;
      msgEl.className = 'text-center text-sm text-teal-600';
      form.reset();
    } else {
      msgEl.textContent = json.message || 'Something went wrong. Please try again.';
      msgEl.className = 'text-center text-sm text-red-500';
      resetBtn();
    }
  } catch (_) {
    msgEl.textContent = 'Network error. Please email us directly at contact@bellatechnologies.in.';
    msgEl.className = 'text-center text-sm text-red-500';
    resetBtn();
  }
});

// Init Lucide icons
lucide.createIcons();
