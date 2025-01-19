import Error from "../components/Error";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function ErrorPage() {
    return (
        <>
            <Navbar />
            <Error />
            <Footer />
        </>
    )
}