import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'

import Header from '../components/Header'
import Testimonial from '../components/Testimonial'
import Spinner from '../components/Spinner'

export default function Testimonial1() {
  return (
    <>
      <Spinner />
      <Navbar />
      <Header name="Testimonial" />
      <Testimonial />
      <Footer />
    </>
  )
}
