import { Nav } from '@/components/paginas-web/Nav'
import { Hero } from '@/components/paginas-web/Hero'
import { Proyectos } from '@/components/paginas-web/Proyectos'
import { Servicios } from '@/components/paginas-web/Servicios'
import { FAQ } from '@/components/paginas-web/FAQ'
import { Footer } from '@/components/paginas-web/Footer'
import { BarraMovil } from '@/components/paginas-web/BarraMovil'
import { Cinta } from '@/components/paginas-web/Cinta'
import { Proceso } from '@/components/paginas-web/Proceso'
import { Formulario } from '@/components/paginas-web/Formulario'
import { SmoothScroll } from '@/components/paginas-web/Movimiento'

export default function PaginasWebPage() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Servicios />
        <Proyectos />
        <Cinta />
        <Proceso />
        <FAQ />
        <Formulario />
      </main>
      <Footer />
      <BarraMovil />
    </>
  )
}
