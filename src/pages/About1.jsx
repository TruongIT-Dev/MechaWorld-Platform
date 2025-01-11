import About from '../components/About'

import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'

import Header from '../components/Header'
import Service from '../components/Service'
import Team from '../components/Team'
import Testimonial from '../components/Testimonial'
import Spinner from '../components/Spinner'

export default function About1() {
  return (
    <>
      <Spinner />
      <Navbar />
      <Header name="About" />
      <About />
      <Service />
      <Team />
      <Testimonial />
      <Footer />
    </>
  )
}
