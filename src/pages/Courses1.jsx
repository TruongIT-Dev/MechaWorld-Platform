import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'

import Cources from '../components/Courses'

import Header from '../components/Header'
import Spinner from '../components/Spinner'

export default function Courses1() {
  return (
    <>
      <Spinner />
      <Navbar />
      <Header name="Courses" />
      <Cources />
      <Footer />
    </>
  )
}
