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

setupContactLinks();
document.querySelector('#year').textContent = new Date().getFullYear();
