import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

// import router
import { HomePage, ErrorPage, ProductPage, AboutPage, SignIn, ProfilePage, UserProfile, Collection, TradeHistory, OrderHistory, Setting } from "./routes/router";

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

          {/* Account */}
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/profile" element={<ProfilePage />} >
            <Route path="user" element={<UserProfile />} />
            <Route path="collection" element={<Collection />} />
            <Route path="tradehistory" element={<TradeHistory />} />
            <Route path="orderhistory" element={<OrderHistory />} />
            <Route path="setting" element={<Setting />} />
          </Route>

          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
