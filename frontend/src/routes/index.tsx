import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import {Nav} from "@/components/portfolio/Nav.tsx";
import {Hero} from "@/components/portfolio/Hero.tsx";
import {Projects} from "@/components/portfolio/Projects.tsx";
import {TechStack} from "@/components/portfolio/TechStack.tsx";
import {Experience} from "@/components/portfolio/Experience.tsx";
import {Contact} from "@/components/portfolio/Contact.tsx";
import {Footer} from "@/components/portfolio/Footer.tsx";

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects', 'public'],
    queryFn: async () => {
      const res = await projectService.list()
      if (!res.ok) return []
      return res.data.projects ?? []
    },
  })

  return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <Nav />
        <Hero />
        <main>
          <Projects projects={data ?? []} loading={isLoading} />
          <TechStack />
          <Experience />
        </main>
        <Contact />
        <Footer />
      </div>
  )
}