import { Routes, Route } from "react-router-dom";

// import router
import { HomePage, ErrorPage, ProductPage, SignIn, ProfilePage, UserProfile, Collection, TradeHistory, OrderHistory, UserLayout, ProductDetailPage, ShopDashboard, ShopPage, ShopProductManagement, ShopTransaction, ExchangePage, ExchangeDetail, CartPage1, Checkout, WalletPage, AdvancedSetting, SettingAddress, ShopRegister, RegisterShopLayout } from "./routes/router";

// import Spinner from "./components/Spinner";

const App = () => {

  return (
    <Routes>
      {/* Layout chính */}
      <Route path="/" element={<UserLayout />} >
        <Route index element={<HomePage />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="exchange" element={<ExchangePage />} />
        <Route path="exchange-detail" element={<ExchangeDetail />} />

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
          {/* <Route path="setting" element={<UserProfile />} /> */}
        </Route>

        {/* Error route */}
        <Route path="error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>

      {/* Layout Đăng ký Shop */}
      <Route path="registe-shop" element={<RegisterShopLayout />}>
        <Route index element={<ShopRegister />} />
      </Route>
    </Routes>
  );

};

export default App;
