import "../../styles/heroBanner.css";
import { RiArrowRightSLine } from "react-icons/ri";

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="overlay">
        <h1 className="hero-title">SEPARADORES DE ARO</h1>
        <button className="cta-btn">
          Ver ahora <RiArrowRightSLine className="arrow-icon" />
        </button>
      </div>
    </section>
  );
}
