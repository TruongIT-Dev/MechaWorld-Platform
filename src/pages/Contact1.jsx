import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'

import Contact from '../components/Contact'

import Spinner from '../components/Spinner'
import Header from '../components/Header'

export default function Contact1() {
  return (
    <>
      <Spinner />
      <Navbar />
      <Header name="Contact" />
      <Contact />
      <Footer />
    </>
  )
}
