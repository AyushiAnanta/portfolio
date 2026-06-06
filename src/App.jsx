import { useState, useRef } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Landing from "./components/sections/Landing";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import ArcadeZone from "./components/sections/ArcadeZone";
import Timeline from "./components/sections/Timeline";
import Contact from "./components/sections/Contact";
import CursorOrb from "./components/CursorOrb";
import CharacterScene from "./components/Character/CharacterScene";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef();

  return (
    <>
      <CursorOrb />
      <CharacterScene />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <Navbar />
      <main>
        <Landing heroRef={heroRef} />
        <About />
        <Projects />
        <ArcadeZone />
        <Timeline />
        <Contact />
      </main>
    </>
  );
}
