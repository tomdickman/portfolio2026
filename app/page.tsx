import Header from "@/components/portfolio/header";
import Hero from "@/components/portfolio/hero";
import About from "@/components/portfolio/about";
import Projects from "@/components/portfolio/projects";
import Experience from "@/components/portfolio/experience";
import Contact from "@/components/portfolio/contact";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Header />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
