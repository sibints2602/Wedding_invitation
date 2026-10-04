"use client";

import { wedding } from "@/content/wedding";
import { useGuestName } from "@/lib/useGuestName";
import { IntroProvider } from "@/components/intro/IntroContext";
import { AudioProvider } from "@/components/chrome/AudioProvider";
import { Envelope } from "@/components/intro/Envelope";
import { LangToggle } from "@/components/chrome/LangToggle";
import { MusicPill } from "@/components/chrome/MusicPill";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { Backdrop } from "@/components/chrome/Backdrop";
import { Petals } from "@/components/chrome/Petals";
import { Hero } from "@/components/sections/Hero";
import { Verse } from "@/components/sections/Verse";
import { Events } from "@/components/sections/Events";
import { Countdown } from "@/components/sections/Countdown";
import { Couple } from "@/components/sections/Couple";
import { Livestream } from "@/components/sections/Livestream";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  const guestName = useGuestName();
  return (
    <IntroProvider>
      <AudioProvider src={wedding.music.src}>
        <Envelope guestName={guestName} />
        <LangToggle />
        <SmoothScroll />
        <Petals />
        <Backdrop>
          <main className="relative">
            <Hero guestName={guestName} />
            <Couple />
            <Verse verse={wedding.verses.hero} />
            <Events />
            <Countdown />
            <Livestream />
            <Footer />
          </main>
        </Backdrop>
        <MusicPill />
      </AudioProvider>
    </IntroProvider>
  );
}
