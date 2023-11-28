import Services from "../../components/services/Services";
import Slider from "../../components/slider/Slider";
import BookSlider from "../../components/book-slider/BookSlider"
import HeadingTitle from "../../components/heading-title/HeadingTitle";
import {books} from "../../data/books"
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const HomePage = () => {
  
  return (
    <section>
      <Header/>
      <Slider />
      <Services />
      <HeadingTitle title="Most gifted" />
      <BookSlider data={books} />
      <HeadingTitle title="Best Seller" />
      <BookSlider data={books} />
      <HeadingTitle title="Most wished for" />
      <BookSlider data={books} />
      <Footer/>
    </section>
  );
};

export default HomePage;
