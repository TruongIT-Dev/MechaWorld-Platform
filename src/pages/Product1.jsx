import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import ProductPage from "../components/Product";
import Spinner from "../components/Spinner";

export default function Product1() {
    return (
        <>
            <Spinner />
            <Navbar />
            <ProductPage />
            <Footer />
        </>
    )
}