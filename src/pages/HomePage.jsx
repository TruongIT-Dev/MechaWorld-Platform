import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

import Hero from "../components/Home/Hero/Hero";
import Popup from "../components/Home/Popup/Popup";
import Banner from "../components/Home/Banner/Banner";
import Spinner from "../components/Spinner";
import Products from "../components/Home/Products/Products";
import Subscribe from "../components/Home/Subscribe/Subscribe";
import ProductsNew from "../components/Home/Products/ProductsNew";
import TopProducts from "../components/Home/TopProducts/TopProducts";
import Testimonials from "../components/Home/Testimonials/Testimonials";

const HomePage = () => {
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

export default HomePage;
