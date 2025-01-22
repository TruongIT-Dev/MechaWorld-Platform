import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

// import router
import { HomePage, ErrorPage, ProductPage, AboutPage, SignIn, ProfilePage, UserProfile, Collection, TradeHistory, OrderHistory, Setting, UserLayout, ProductDetailPage } from "./routes/router";

import Spinner from "./components/Spinner";

const App = () => {

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<UserLayout />} >
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product" element={<ProductPage />} />

            {/* Login route */}
            <Route path="/signIn" element={<SignIn />} />

            {/* Detail Product route */}
            <Route path="/product-detail" element={<ProductDetailPage />} />


            {/* Profile route */}
            <Route path="/profile" element={<ProfilePage />} >
              <Route path="user" element={<UserProfile />} />
              <Route path="collection" element={<Collection />} />
              <Route path="tradehistory" element={<TradeHistory />} />
              <Route path="orderhistory" element={<OrderHistory />} />
              <Route path="setting" element={<Setting />} />
            </Route>

            {/* Error route */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>

      </Suspense>
    </>
  );
};

export default App;
