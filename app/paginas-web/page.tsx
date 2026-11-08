import { Nav } from '@/components/paginas-web/Nav'
import { Hero } from '@/components/paginas-web/Hero'
import { Proyectos } from '@/components/paginas-web/Proyectos'

export default function PaginasWebPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Proyectos />
      </main>
    </>
  )
}
