const siteConfig = {
  appName: 'FluxOS',
  whatsapp: '5581973131156', // Somente dígitos, incluindo país e DDD.
  email: 'fluxos.gestaofacil@gmail.com',
  whatsappMessage: 'Olá! Tenho interesse no aplicativo de gestão de ordens de serviço e gostaria de saber mais.',
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

setupContactLinks();
setupScrollReveals();
document.querySelector('#year').textContent = new Date().getFullYear();
