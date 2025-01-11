import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'

import Slide from '../components/Slide'
import Service from '../components/Service'
import About from '../components/About'
import Courses from '../components/Courses'
import Team from '../components/Team'
import Testimonial from '../components/Testimonial'
import Spinner from '../components/Spinner'

export default function Home() {
    return (
        <>
            <Spinner />
            <Navbar />
            <Slide />
            <Service />
            <About />
            <Courses />
            <Team />
            <Testimonial />
            <Footer />
            <a href="#" className="btn btn-primary back-to-top"><i className="bi bi-arrow-up"></i></a>
        </>
    )
}
