import { Routes, Route } from "react-router-dom";
import  { Suspense } from "react";
// import router
import { HomePage, ErrorPage, ProductPage, SignIn, ProfilePage, UserProfile, Collection, TradeHistory, OrderHistory, UserLayout, ProductDetailPage, ShopDashboard, ShopPage, ShopProductManagement, ShopTransaction, ExchangePage, ExchangeDetail, CartPage1, Checkout, WalletPage, AdvancedSetting, SettingAddress, ShopOrderManagement, ShopAuctionManagement, ShopReportManagement, ShopRegister, RegisterShopLayout,AutionList,AutionDetail } from "./routes/router";
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
        <Route path="signIn" element={<SignIn />} />

        {/* Cart route */}
        <Route path="cart" element={<CartPage1 />} />

        {/* Checkout route */}
        <Route path="checkout" element={<Checkout />} />

        {/* Wallet user route */}
        <Route path="wallet" element={<WalletPage />} />

        {/* Profile Route */}
        <Route path="profile" element={<ProfilePage />}>
          <Route path="user" element={<UserProfile />} />
          <Route path="collection" element={<Collection />} />
          <Route path="tradehistory" element={<TradeHistory />} />
          <Route path="orderhistory" element={<OrderHistory />} />
          <Route path="advanced-setting" element={<AdvancedSetting />} />
          <Route path="address-setting" element={<SettingAddress />} />
        </Route>

        {/* Shop Route */}
        <Route path="shop" element={<ShopPage />}>
          <Route path="dashboard" element={<ShopDashboard />} />
          <Route path="management" element={<ShopProductManagement />} />
          <Route path="transition" element={<ShopTransaction />} />
            <Route path="order-management" element={<ShopOrderManagement />} />
            <Route path="auction-management" element={<ShopAuctionManagement />} />
            <Route path="report-management" element={<ShopReportManagement />} />
          {/* <Route path="setting" element={<UserProfile />} /> */}
        </Route>

        {/* Aution Route */}
        <Route path="aution" element={<AutionList />}/>       
        <Route path="aution/detail" element={<AutionDetail />} />

        
        {/* Error route */}
        <Route path="error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>

      {/* Layout Đăng ký Shop */}
      <Route path="registe-shop" element={<RegisterShopLayout />}>
        <Route index element={<ShopRegister />} />
      </Route>
    </Routes>
    </Suspense>
  );

}

export default App;
