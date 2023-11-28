import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import "./about.css";

const About = () => {
  return (
    <div>
    <Header/>
    <section className="about">
      <h1>About Us</h1>
      <p>We are an online book store</p>
      <p>
        <strong>Version: 1.0.0</strong>
      </p>
    </section>
    <Footer/>
    </div>

  );
};

export default About;
