import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso de privacidad | Delta Analytics',
  robots: { index: false },
}

export default function AvisoDePrivacidad() {
  return (
    <main className="min-h-screen bg-base px-6 py-20 text-white">
      <article className="mx-auto max-w-[760px]">
        <a href="/paginas-web" className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
          ← Volver
        </a>
        <h1 className="mt-8 font-display text-[clamp(36px,6vw,64px)] font-extrabold uppercase leading-[0.95] tracking-tight">
          Aviso de privacidad
        </h1>
        <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted">Última actualización: 8 de noviembre de 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-white/85">
          <section>
            <h2 className="font-display text-xl font-extrabold uppercase">Responsable</h2>
            <p className="mt-2">
              Delta Analytics S. de R.L. de C.V. (&ldquo;Delta Analytics&rdquo;), con domicilio en [DOMICILIO], es responsable del tratamiento de tus datos personales.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-extrabold uppercase">Datos que recabamos</h2>
            <p className="mt-2">
              Nombre, número de WhatsApp, correo electrónico (opcional), giro de tu negocio, tu situación actual con tu página web (opcional) y el mensaje que nos escribas. También datos de la campaña por la que llegaste (por ejemplo, parámetros UTM e identificador de clic de anuncio).
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-extrabold uppercase">Para qué los usamos</h2>
            <p className="mt-2">
              Para contactarte sobre tu solicitud, enviarte una cotización o diagnóstico, dar seguimiento a tu proyecto y medir el desempeño de nuestras campañas publicitarias.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-extrabold uppercase">Con quién los compartimos</h2>
            <p className="mt-2">
              No vendemos tus datos. Los compartimos únicamente con proveedores que nos prestan servicios de infraestructura (alojamiento, base de datos y correo), necesarios para operar este sitio.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-extrabold uppercase">Tus derechos</h2>
            <p className="mt-2">
              Puedes acceder, rectificar o cancelar tus datos, y oponerte a su tratamiento (derechos ARCO), escribiendo a contacto@deltaanalytics.com.mx. También puedes revocar tu consentimiento por el mismo medio.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-extrabold uppercase">Cambios a este aviso</h2>
            <p className="mt-2">Cualquier cambio se publicará en esta misma página.</p>
          </section>
        </div>
      </article>
    </main>
  )
}
