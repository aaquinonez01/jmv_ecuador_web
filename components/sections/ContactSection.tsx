'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone, MapPin, MessageSquare, User, Send, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import ScrollReveal from '@/components/ui/ScrollReveal'
import dynamic from 'next/dynamic'
import { contactSchema, type ContactFormData } from '@/lib/contactValidation'

export default function ContactSection() {
  const MapaInteractivo = dynamic(() => import('@/components/ui/MapaInteractivo'), { ssr: false })
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nombre: '', email: '', asunto: '', mensaje: '' },
  })

  const onSubmit = async (data: ContactFormData) => {
    setServerMessage(null)
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.message || 'Error al enviar el mensaje')
      }
      setServerMessage({ type: 'success', text: json?.message || 'Mensaje enviado correctamente' })
      reset()
    } catch (e: any) {
      setServerMessage({ type: 'error', text: e?.message || 'No se pudo enviar el mensaje' })
    }
  }

  return (
    <section className="relative pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-jmv-blue-dark via-blue-900 to-blue-800 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <ScrollReveal direction="up" delay={100}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Estamos aquí para ayudarte
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Contáctanos
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Si deseas unirte, colaborar o tienes preguntas sobre JMV Ecuador, envíanos un mensaje y te responderemos.
            </p>
          </ScrollReveal>
        </div>

        {/* Tarjetas de contacto */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ScrollReveal direction="up" delay={200}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Correo</h3>
              <p className="text-white/80 mb-3">Escríbenos y te responderemos</p>
              <a href="mailto:contacto@jmvecuador.org" className="text-jmv-gold hover:underline">
                contacto@jmvecuador.org
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Teléfono</h3>
              <p className="text-white/80 mb-3">Lunes a Viernes, 9:00–17:00</p>
              <a href="tel:+59321234567" className="text-jmv-gold hover:underline">
                +593 2 123 4567
              </a>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Ubicación</h3>
              <p className="text-white/80 mb-3">Sede Nacional JMV Ecuador</p>
              <span className="text-jmv-gold">Quito, Ecuador</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Formulario */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <ScrollReveal direction="up" delay={200}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 sm:p-8 shadow-jmv">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-gray-800 mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-3.5 w-5 h-5 ${errors.nombre ? 'text-red-400' : 'text-gray-400'}`} />
                    <input
                      id="nombre"
                      type="text"
                      {...register('nombre')}
                      placeholder="Tu nombre completo"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-jmv-blue/20 ${
                        errors.nombre ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-jmv-blue'
                      }`}
                    />
                  </div>
                  {errors.nombre && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nombre.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="tu@ejemplo.com"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-jmv-blue/20 ${
                        errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-jmv-blue'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="asunto" className="block text-sm font-semibold text-gray-800 mb-2">
                  Asunto
                </label>
                <div className="relative">
                  <MessageSquare className={`absolute left-3 top-3.5 w-5 h-5 ${errors.asunto ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    id="asunto"
                    type="text"
                    {...register('asunto')}
                    placeholder="Motivo del mensaje"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-jmv-blue/20 ${
                      errors.asunto ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-jmv-blue'
                    }`}
                  />
                </div>
                {errors.asunto && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.asunto.message}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-800 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  rows={6}
                  {...register('mensaje')}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-jmv-blue/20 ${
                    errors.mensaje ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-jmv-blue'
                  }`}
                />
                {errors.mensaje && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.mensaje.message}
                  </p>
                )}
              </div>

              {serverMessage && (
                <div
                  className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
                    serverMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {serverMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`text-sm ${serverMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {serverMessage.text}
                  </p>
                </div>
              )}

              <div className="mt-8">
                <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </Button>
              </div>
            </form>
          </ScrollReveal>

          {/* Mapa */}
          <ScrollReveal direction="up" delay={300}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <MapaInteractivo />
              <p className="text-white/80 text-sm mt-3 px-2">
                Encuentra comunidades JMV en todo el país y conecta con la sede más cercana.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
