import Hero from "./components/Hero";
import Calculator from "./components/Calculator";
import HowItWorks from "./components/HowItWorks";
import Clusters from "./components/Clusters";
import FareMatrix from "./components/FareMatrix";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div id="top" className="min-h-screen">
      <Hero />
      <main>
        <Calculator />
        <HowItWorks />
        <Clusters />
        <FareMatrix />
      </main>
      <Footer />
    </div>
  );
}
