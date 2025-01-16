import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

// import router
import { About1, Contact1, Courses1, Dsa, ErrorPage, FeedbackAll, Fullstack, Home, Javaprog, Mern, Product1, Profile, Programming, SignUp, Team1, Testimonial1 } from "./routes/router";

import Spinner from "./components/Spinner";


function App() {
  return (
    <>
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
    </>
  );
}

export default App;
