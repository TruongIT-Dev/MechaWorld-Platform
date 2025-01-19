import React from "react";
import Navbar from "./Navbar/Navbar";
import Hero from "./Hero/Hero";
import ProductsNew from "./Products/ProductsNew";
import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./TopProducts/TopProducts";
import Banner from "./Banner/Banner";
import Subscribe from "./Subscribe/Subscribe";
import Testimonials from "./Testimonials/Testimonials";
import Footer from "./Footer/Footer";
import Popup from "./Popup/Popup";
import Products from "./Products/Products";

const Home = () => {
    const [orderPopup, setOrderPopup] = React.useState(false);

    const handleOrderPopup = () => {
        setOrderPopup(!orderPopup);
    };
    React.useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
        });
        AOS.refresh();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
            <Navbar handleOrderPopup={handleOrderPopup} />
            <Hero handleOrderPopup={handleOrderPopup} />
            <ProductsNew />
            <TopProducts handleOrderPopup={handleOrderPopup} />
            <Banner />
            <Subscribe />
            <Products />
            <Testimonials />
            <Footer />
            <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
        </div>
    );
};

export default Home;
