import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

// import router
import { HomePage, ErrorPage, ProductPage, AboutPage } from "./routes/router";

import Spinner from "./components/Spinner";

const App = () => {

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Routes>

          {/* Guest View */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product" element={<ProductPage />} />

          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
