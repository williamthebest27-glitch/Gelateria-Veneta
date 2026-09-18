import { CinematicSpot } from "@/components/CinematicSpot";
import { Contacts } from "@/components/Contacts";
import { FlavorShowcase } from "@/components/FlavorShowcase";
import { GelatoLive } from "@/components/GelatoLive";
import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/Pillars";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <FlavorShowcase />
        <Pillars />
        <GelatoLive />
        <CinematicSpot />
        <Contacts />
      </main>
    </>
  );
}
