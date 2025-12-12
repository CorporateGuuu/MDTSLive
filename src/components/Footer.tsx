export default function Footer() {
  const footerLinks = {
    about: [
      { href: '/about', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/quality-standards', label: 'Quality Standards' },
      { href: '/return-policy', label: 'Return Policy' },
      { href: '/privacy-policy', label: 'Privacy Policy' }
    ],
    services: [
      { href: '/my-account', label: 'My Account' },
      { href: '/lcd-buyback', label: 'LCD Buyback' },
      { href: '/pre-owned-devices', label: 'Pre-Owned Devices' }
    ],
    support: [
      { href: '/contact', label: 'Contact Us' },
      { href: '#', label: 'Live Chat' },
      { href: 'tel:+18885558324', label: '1-888-555-TECH' },
      { href: 'https://wa.me/18885558324', label: 'WhatsApp' },
      { href: 'mailto:sales@midastechnical.com', label: 'Email' }
    ]
  };

  const socialLinks = [
    { href: '#', icon: 'fab fa-facebook' },
    { href: '#', icon: 'fab fa-instagram' },
    { href: '#', icon: 'fab fa-youtube' },
    { href: '#', icon: 'fab fa-linkedin' },
    { href: '#', icon: 'fab fa-twitter' }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 py-16 px-5 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 blur-3xl"></div>
      </div>

      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-white mb-4">
              Nexus<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">T</span>ech Hub
            </div>
            <p className="mb-4"><strong className="text-emerald-300">United States</strong></p>
            <p className="mb-4">English | USD</p>
            {/* Payment icons placeholder */}
            <div className="flex space-x-2">
              <div className="w-10 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded opacity-80"></div>
              <div className="w-10 h-6 bg-gradient-to-r from-teal-600 to-cyan-600 rounded opacity-80"></div>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h5 className="text-white text-lg font-semibold mb-5 border-b border-emerald-500/30 pb-2">About</h5>
            <ul className="space-y-2">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-emerald-300 transition-colors block py-0.5">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="text-white text-lg font-semibold mb-5 border-b border-teal-500/30 pb-2">Services</h5>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-teal-300 transition-colors block py-0.5">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-white text-lg font-semibold mb-5 border-b border-cyan-500/30 pb-2">Support</h5>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-cyan-300 transition-colors block py-0.5"
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-10 pt-6 text-center">
          <div className="flex justify-center items-center mb-4 space-x-4">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} className="text-gray-400 hover:text-emerald-300 text-xl transition-colors transform hover:scale-110">
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            © 2025 Midas Technical Solutions. All trademarks are property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
