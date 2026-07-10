// Single source of truth for social / contact profiles.
// Consumed by Contact (full grid) and Footer (icon row).
export const socialLinks = [
  {
    id: 'github',
    label: 'GitHub',
    username: 'UmarjonMX',
    href: 'https://github.com/UmarjonMX',
    icon: '/icons/github.png',
    external: true,
    footerOrder: 1,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    username: 'Umarjon Muhammadjonov',
    href: 'https://www.linkedin.com/in/umarjon-muhammadjonov-4ba177281',
    icon: '/icons/linkedin.png',
    external: true,
    footerOrder: 2,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    username: '@umarjonmx',
    href: 'https://instagram.com/umarjonmx',
    icon: '/icons/instagram.png',
    external: true,
    footerOrder: 4,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    username: '@UmarjonMX',
    href: 'https://t.me/UmarjonMX',
    icon: '/icons/telegram.png',
    external: true,
    footerOrder: 3,
  },
  {
    id: 'phone',
    label: 'Phone',
    username: '+998 97 123 36 67',
    href: 'tel:+998971233667',
    icon: '/icons/phone.png',
    external: false,
    footerOrder: null,
  },
  {
    id: 'email',
    label: 'Email',
    username: 'umarmx2008@gmail.com',
    href: 'mailto:umarmx2008@gmail.com',
    icon: '/icons/mail.png',
    external: false,
    footerOrder: null,
  },
];

// Links shown in the footer, in their intended display order.
export const footerSocialLinks = socialLinks
  .filter((link) => link.footerOrder != null)
  .sort((a, b) => a.footerOrder - b.footerOrder);
