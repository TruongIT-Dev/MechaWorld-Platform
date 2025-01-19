import About from "../components/About/About";
import Spinner from "../components/Spinner";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <About />
            <Footer />
        </>
    )
}