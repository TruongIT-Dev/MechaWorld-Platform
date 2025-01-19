import AOS from "aos";
import React from "react";

import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

import Product from "../components/Product/Product";

export default function ProductPage() {

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
        <>
            <Navbar handleOrderPopup={handleOrderPopup} />
            <Product />
            <Footer />
        </>
    )
}