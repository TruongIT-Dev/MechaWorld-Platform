import { Routes, Route } from "react-router-dom";
import  { Suspense } from "react";
// import router
import { HomePage, ErrorPage, ProductPage, AboutPage, SignIn, ProfilePage, UserProfile, Collection, TradeHistory, OrderHistory, UserLayout, ProductDetailPage, ShopDashboard, ShopPage, ShopProductManagement, ShopTransaction, CartPage, ShopRegister, ExchangePage, ExchangeDetail, CartPage1, Checkout, WalletPage, SellerRegister,AdvancedSetting,SettingAddress, ShopOrderManagement, ShopAuctionManagement, ShopReportManagement } from "./routes/router";
import { useSelector } from "react-redux";

// import Spinner from "./components/Spinner";

function App  () {
  const accessToken = useSelector((state) => state.auth.access_token);
  const userId = useSelector((state) => state.auth.user);
  console.log(accessToken, userId);
  
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <Routes>
        <Route path="/" element={<UserLayout />} >
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/exchange-detail" element={<ExchangeDetail />} />

          {/* Login route */}
          <Route path="/signIn" element={<SignIn />} />


          {/* Cart route */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart1" element={<CartPage1 />} />

          {/* checkout route */}
          <Route path="/checkout" element={<Checkout />} />

          {/* wallet user route */}
          <Route path="/wallet" element={<WalletPage />} />

          {/* Profile route */}
          <Route path="/profile" element={<ProfilePage />} >
            <Route path="user" element={<UserProfile />} />
            <Route path="collection" element={<Collection />} />
            <Route path="tradehistory" element={<TradeHistory />} />
            <Route path="orderhistory" element={<OrderHistory />} />
            <Route path="advanced-setting" element={<AdvancedSetting />} />
            <Route path="address-setting" element={<SettingAddress />} />
            <Route path="shop-register" element={<ShopRegister />} />
            <Route path="seller" element={<SellerRegister />} />
           
          </Route>

          {/* Shop Route*/}
          <Route path="/shop" element={<ShopPage />}>
            <Route path="dashboard" element={<ShopDashboard />} />
            <Route path="management" element={<ShopProductManagement />} />
            <Route path="transition" element={<ShopTransaction />} />
            <Route path="order-management" element={<ShopOrderManagement />} />
            <Route path="auction-management" element={<ShopAuctionManagement />} />
            <Route path="report-management" element={<ShopReportManagement />} />
            {/* <Route path="setting" element={<UserProfile />} /> */}
          </Route>

          {/* Error route */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />

        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
