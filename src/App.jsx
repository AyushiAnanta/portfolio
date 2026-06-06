import { useState, useRef } from "react";
import Loader from "./components/Loader";
import Landing from "./components/sections/Landing";
import About from "./components/sections/About";
import CursorOrb from "./components/CursorOrb";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef();

  return (
    <>
      <CursorOrb />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <main>
        <Landing heroRef={heroRef} />
        <About />
      </main>
    </>
  );
}
