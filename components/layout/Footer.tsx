'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  'Quiénes Somos': [
    { name: 'Nuestra Historia', href: '/quienes-somos/historia' },
    { name: 'Organización', href: '/quienes-somos/organizacion' },
    { name: 'Espiritualidad Vicenciana', href: '/quienes-somos/espiritualidad' },
  ],
  'Qué Hacemos': [
    { name: 'Nuestros Pilares', href: '/que-hacemos/pilares' },
    { name: 'Áreas de Acción', href: '/que-hacemos/areas' },
    { name: 'Proyectos', href: '/que-hacemos/proyectos' },
  ],
  'Formación': [
    { name: 'Ejes Formativos', href: '/formacion/ejes' },
    { name: 'Santos Vicencianos', href: '/formacion/santos' },
    { name: 'Materiales', href: '/formacion/materiales' },
  ],
  'Participar': [
    { name: 'Únete a JMV', href: '/unete' },
    { name: 'Actividades', href: '/actividades' },
    { name: 'Voluntariado', href: '/voluntariado' },
    { name: 'Donaciones', href: '/donaciones' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Twitter', href: '#', icon: Twitter },
]

export default function Footer() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <footer className={`bg-jmv-blue text-white ${isAdmin ? 'ml-72' : ''}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-jmv-gold to-jmv-red flex items-center justify-center">
                <span className="text-white font-bold text-xl">JMV</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">
                  Juventudes Marianas
                </h1>
                <p className="text-sm text-jmv-gold">
                  Vicencianas Ecuador
                </p>
              </div>
            </Link>
            <p className="text-sm text-blue-100 mb-6">
              Formando jóvenes comprometidos con el servicio, la fe y la transformación social bajo el carisma vicenciano.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-jmv-gold" />
                <span>contacto@jmvecuador.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-jmv-gold" />
                <span>+593 2 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-jmv-gold" />
                <span>Quito, Ecuador</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-jmv-gold">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-blue-400">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-jmv-gold">
              Mantente Informado
            </h3>
            <p className="text-sm text-blue-100 mb-4">
              Suscríbete a nuestro boletín para recibir noticias y actividades de JMV Ecuador.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-jmv-gold"
              />
              <button
                type="submit"
                className="bg-jmv-gold text-jmv-blue px-6 py-2 rounded-lg font-medium text-sm hover:bg-jmv-gold-dark transition-colors duration-200"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-jmv-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Copyright */}
            <p className="text-sm text-blue-200">
              © {new Date().getFullYear()} Juventudes Marianas Vicencianas Ecuador. Todos los derechos reservados.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
