import { Routes, Route } from "react-router-dom";

// import router
import { HomePage, ErrorPage, ProductPage, AboutPage, SignIn, ProfilePage, UserProfile, Collection, TradeHistory, OrderHistory, Setting, UserLayout, ProductDetailPage, ShopDashboard, ShopPage, ShopProductManagement, ShopTransaction, CartPage } from "./routes/router";

// import Spinner from "./components/Spinner";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<UserLayout />} >
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />

          {/* Login route */}
          <Route path="/signIn" element={<SignIn />} />


          {/* Cart route */}
          <Route path="/cart" element={<CartPage />} />

          {/* Profile route */}
          <Route path="/profile" element={<ProfilePage />} >
            <Route path="user" element={<UserProfile />} />
            <Route path="collection" element={<Collection />} />
            <Route path="tradehistory" element={<TradeHistory />} />
            <Route path="orderhistory" element={<OrderHistory />} />
            <Route path="setting" element={<Setting />} />
          </Route>

          {/* Shop Route*/}
          <Route path="/shop" element={<ShopPage />}>
            <Route path="dashboard" element={<ShopDashboard />} />
            <Route path="management" element={<ShopProductManagement />} />
            <Route path="transition" element={<ShopTransaction />} />
            {/* <Route path="setting" element={<UserProfile />} /> */}
          </Route>
          
          {/* Error route */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        
        </Route>
      </Routes>
    </>
  );
};

export default App;
