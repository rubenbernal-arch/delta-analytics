import { Nav }           from '@/components/Nav'
import { HeroAssembly }  from '@/components/sections/HeroAssembly'
import { About }         from '@/components/sections/About'
import { Mission }       from '@/components/sections/Mission'
import { Products }      from '@/components/sections/Products'
import { Contact }       from '@/components/sections/Contact'
import { Footer }        from '@/components/Footer'

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-4 bg-accent text-white px-4 py-2 rounded-b-lg z-[9999]"
      >
        Saltar al contenido
      </a>
      <Nav />
      <span id="main" aria-hidden="true" className="absolute top-0 outline-none" />
      <main>
        <HeroAssembly />
        <About />
        <Mission />
        <Products />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
