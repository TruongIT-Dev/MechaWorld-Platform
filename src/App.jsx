import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About1 from "./pages/About1";
import Courses1 from "./pages/Courses1";
import Team1 from "./pages/Team1";
import Testimonial1 from "./pages/Testimonial1";
import Contact1 from "./pages/Contact1";

import ErrorPage from "./components/ErrorPage";
import SignUp from "./components/Register";
import Profile from "./components/Profile";
import FeedbackAll from "./components/FeedbackAll";

import Javaprog from "./components/Course/Javaprog";
import Dsa from "./components/Course/Dsa";
import Mern from "./components/Course/Mern";
import Fullstack from "./components/Course/Fullstack";
import Programming from "./components/Course/Programming";
import Product1 from "./pages/Product1";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About1 />} />
        <Route path="/courses" element={<Courses1 />} />
        <Route path="/team" element={<Team1 />} />
        <Route path="/testimonial" element={<Testimonial1 />} />
        <Route path="/contact" element={<Contact1 />} />
        <Route path="/error" element={<ErrorPage />} />

        <Route path="/register" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />

        {/* Product page */}
        <Route path="/product-page" element={<Product1 />} />

        <Route path="/courses/java" element={<Javaprog />} />
        <Route path="/courses/dsa" element={<Dsa />} />

        <Route path="/courses/mern" element={<Mern />} />

        <Route path="/courses/fullstack" element={<Fullstack />} />

        <Route path="/cources/programming" element={<Programming />} />

        <Route path="/feedback" element={<FeedbackAll />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
