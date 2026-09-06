const siteConfig = {
  appName: 'FluxOS',
  whatsapp: '5581973131156', // Somente dígitos, incluindo país e DDD.
  email: 'fluxos.gestaofacil@gmail.com',
  whatsappMessage: 'Olá! Tenho interesse no aplicativo de gestão de ordens de serviço e gostaria de saber mais.',
  interestMessages: {
    essencial: 'Olá! Tenho interesse no plano Essencial do FluxOS e gostaria de saber mais.',
    plus: 'Olá! Tenho interesse no plano Plus do FluxOS e gostaria de saber mais.',
    undecided: 'Olá! Tenho interesse no FluxOS e gostaria de saber mais, mas ainda não decidi qual plano é ideal para minha operação.',
  },
  emailSubject: 'Interesse no aplicativo de gestão de ordens de serviço',
};

function setupContactLinks() {
  const whatsappUrl = siteConfig.whatsapp
    ? `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`
    : null;
  const emailUrl = siteConfig.email
    ? `mailto:${siteConfig.email}?subject=${encodeURIComponent(siteConfig.emailSubject)}`
    : null;

  document.querySelectorAll('[data-contact]').forEach((link) => {
    const target = link.dataset.contact === 'whatsapp' ? whatsappUrl : emailUrl;
    if (!target) {
      link.setAttribute('aria-disabled', 'true');
      link.dataset.pending = 'true';
      link.addEventListener('click', (event) => event.preventDefault());
      return;
    }
    link.href = target;
    if (link.dataset.contact === 'whatsapp') link.target = '_blank';
  });

  if (whatsappUrl && emailUrl) {
    document.querySelectorAll('.contact-note').forEach((note) => note.remove());
  }
}

function setupScrollReveals() {
  const items = [
    ...document.querySelectorAll('.intro > *, .section-heading > *, .feature-card, .workflow-intro, .steps li, .plans .section-heading > *, .plan-card, .faq-heading, .accordion details, .contact-content > *, .footer-inner > *'),
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${Math.min((index % 5) * 70, 280)}ms`);
  });

  if (reduceMotion || typeof window.IntersectionObserver !== 'function') {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  let observer;
  const reveal = (item) => {
    item.classList.add('is-visible');
    observer?.unobserve(item);
  };
  const revealVisibleItems = () => {
    items.forEach((item) => {
      const position = item.getBoundingClientRect();
      if (position.top < window.innerHeight * 0.92 && position.bottom > -48) reveal(item);
    });
  };
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -42px' });

  items.forEach((item) => {
    observer.observe(item);
    item.addEventListener('focusin', () => reveal(item), { once: true });
  });
  revealVisibleItems();
  let scrolling = false;
  window.addEventListener('scroll', () => {
    if (scrolling) return;
    scrolling = true;
    window.requestAnimationFrame(() => {
      revealVisibleItems();
      scrolling = false;
    });
  }, { passive: true });
}

function setupEmailDialog() {
  const dialog = document.querySelector('#email-dialog');
  const emailAddress = document.querySelector('#email-address');
  const emailMessage = document.querySelector('#email-message');
  const messageButton = dialog.querySelector('[data-copy="message"]');
  let selectedMessage = '';
  const copiedTimers = new WeakMap();
  const particles = '<span class="neon-checkbox__particles" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span>';

  emailAddress.textContent = siteConfig.email;
  dialog.querySelectorAll('.neon-checkbox__frame').forEach((frame) => frame.insertAdjacentHTML('beforeend', particles));

  document.querySelectorAll('[data-contact="email"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (!dialog.open) {
        document.body.style.overflow = 'hidden';
        dialog.showModal();
      }
    });
  });

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
  }

  function showCopied(button) {
    const label = button.querySelector('.copy-button__label');
    clearTimeout(copiedTimers.get(button));
    button.dataset.copied = 'true';
    label.textContent = 'Copiado!';
    copiedTimers.set(button, setTimeout(() => {
      delete button.dataset.copied;
      label.textContent = button.dataset.copy === 'email' ? 'Copiar e-mail' : 'Copiar mensagem';
    }, 2000));
  }

  dialog.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => {
      const isEmail = button.dataset.copy === 'email';
      copyText(isEmail ? siteConfig.email : selectedMessage);
      showCopied(button);
    });
  });

  dialog.querySelectorAll('[data-interest]').forEach((input) => {
    input.addEventListener('change', () => {
      selectedMessage = siteConfig.interestMessages[input.dataset.interest];
      emailMessage.textContent = selectedMessage;
      messageButton.disabled = false;
    });
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    dialog.querySelectorAll('[data-copied]').forEach((button) => {
      clearTimeout(copiedTimers.get(button));
      delete button.dataset.copied;
      button.querySelector('.copy-button__label').textContent = button.dataset.copy === 'email' ? 'Copiar e-mail' : 'Copiar mensagem';
    });
  });
}

setupContactLinks();
setupScrollReveals();
setupEmailDialog();
document.querySelector('#year').textContent = new Date().getFullYear();
