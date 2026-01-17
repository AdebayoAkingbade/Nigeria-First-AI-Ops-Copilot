import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/sections/hero";
import { ProblemSolution } from "@/components/sections/problem-solution";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhatsAppFeature } from "@/components/sections/whatsapp-feature";
import { Features } from "@/components/sections/features";
import { VideoDemo } from "@/components/sections/video-demo";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { Footer } from "@/components/layout/footer";





export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <HeroSection />
      <ProblemSolution />
      <HowItWorks />
      <WhatsAppFeature />
      <Features />
      <VideoDemo />
      <Testimonials />
      <Pricing />
      <Footer />



    </main>
  );
}
