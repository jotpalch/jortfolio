import HeroSection from "@/components/home/HeroSection";
import WhatIDoPanel from "@/components/home/WhatIDoPanel";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import FilmStrip from "@/components/home/FilmStrip";
import AwardsCTA from "@/components/home/AwardsCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="space-y-12 py-12 pb-24 sm:space-y-20 sm:py-20 sm:pb-32">
        <WhatIDoPanel />
        <FeaturedProjects />
        <FilmStrip />
        <AwardsCTA />
      </div>
    </>
  );
}
