import { Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
// import router
import {
  HomePage,
  ProductPage,
  SignIn,
  ProfilePage,
  UserProfile,
  TradeHistory,
  OrderHistory,
  UserLayout,
  ProductDetailPage,
  ShopDashboard, ShopPage,
  ShopProductManagement,
  ShopTransaction, ExchangePage,
  CartPage1,
  Checkout,
  WalletPage,
  SettingAddress,
  ShopOrderManagement,
  ShopAuctionManagement,
  ShopReportManagement,
  ShopRegister,
  RegisterShopLayout,
  AutionList,
  AutionDetail,
  AddProductToAution,
  ListProductToAution,
  CensorProductToAution,
  ModeratorLayout,
  SignUp,
  ModFeedbacks,
  ModAuctions,
  ModOrders,
  ModTransactions,
  ModRefunds,
  ModGundams,
  ModUsers,
  ModExchanges,
  ExchangeDetailInformation,
  ExchangeGundamManagement,
  Collection,
  AddCollection,
  ListCollection,
  ShopInfo,
  ShopAddress,
  PageNotFound,
  ExchangeList,
  ExchangeManage,
  ExchangeMyPost,

} from "./routes/router";

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

import { verifyToken } from "./apis/Authentication/APIAuth";
import { logout, updateUser } from "./features/auth/authSlice";

import Spinner from "./components/Spinner";
import PageLoading from "./components/PageLoading";

function App() {

  const dispatch = useDispatch();

  // const accessToken = useSelector((state) => state.auth.access_token);
  // const userId = useSelector((state) => state.auth.user);

  // console.log(accessToken, userId);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      verifyToken(accessToken).then((userData) => {
        if (userData) {
          // console.log(userData)
          dispatch(updateUser(userData.data));
        } else {
          dispatch(logout());
        }
      });
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <>
      <PageLoading /> {/* Hiệu ứng loading khi chuyển trang */}
      <Suspense fallback={<Spinner />}> {/* Loading khi tải component */}
        <Routes>
          <Route path="/" element={<UserLayout />} >
            <Route index element={<HomePage />} />

            {/* Product Route */}
            <Route path="product" element={<ProductPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />


            {/* Aution Route */}
            <Route path="aution" element={<AutionList />} />
            <Route path="aution/detail" element={<AutionDetail />} />

            <Route path="admin/aution" element={<CensorProductToAution />} />


            {/* Exchange Main Route */}
            <Route path="/exchange" element={<ExchangePage />}>
              <Route path="list" element={<ExchangeList />} />
              <Route path="manage-gundam" element={<ExchangeGundamManagement />} />
              <Route index element={<ExchangeList />} />
            </Route>

            {/* Exchange Route */}
            <Route path="/exchange/manage" element={<ExchangeManage />} />
            <Route path="/exchange/my-post" element={<ExchangeMyPost />} />
            <Route path="/exchange/detail/section" element={<ExchangeDetailInformation />} />


            {/* Collection Route */}
            <Route path="collection" element={<Collection />} >
              <Route path="list" element={<ListCollection />} />
              <Route path="add" element={<AddCollection />} />
            </Route>
            
            {/* Cart route */}
            <Route path="cart" element={<CartPage1 />} />


            {/* Checkout route */}
            <Route path="checkout" element={<Checkout />} />

            {/* Member Profile Route */}
            <Route path="member/profile" element={<ProfilePage />}>
              <Route path="account" element={<UserProfile />} />
              <Route path="tradehistory" element={<TradeHistory />} />
              <Route path="orderhistory" element={<OrderHistory />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="address-setting" element={<SettingAddress />} />
              <Route path="addProductAution" element={<AddProductToAution />} />
              <Route path="listProductAution" element={<ListProductToAution />} />
            </Route>

            {/* Shop Route */}
            <Route path="shop" element={<ShopPage />}>
              <Route path="dashboard" element={<ShopDashboard />} />
              <Route path="info" element={<ShopInfo />} />
              <Route path="address" element={<ShopAddress />} />
              <Route path="management" element={<ShopProductManagement />} />
              <Route path="transition" element={<ShopTransaction />} />
              <Route path="order-management" element={<ShopOrderManagement />} />
              <Route path="auction-management" element={<ShopAuctionManagement />} />
              <Route path="report-management" element={<ShopReportManagement />} />
            </Route>


            {/* Error route */}
            <Route path="error" element={<PageNotFound />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Những Route khác */}

          {/* Login & Signup */}
          <Route path="member">
            <Route path="login" index element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          {/* Moderator Route */}
          <Route path="moderator" element={<ModeratorLayout />} >
            <Route index element={<ModUsers />} />
            <Route path="mod-users" element={<ModUsers />} />
            <Route path="mod-auctions" element={<ModAuctions />} />
            <Route path="mod-orders" element={<ModOrders />} />
            <Route path="mod-transactions" element={<ModTransactions />} />
            <Route path="mod-refunds" element={<ModRefunds />} />
            <Route path="mod-gundams" element={<ModGundams />} />
            <Route path="mod-feedbacks" element={<ModFeedbacks />} />
            <Route path="mod-exchanges" element={<ModExchanges />} />
          </Route>

          {/* Admin Route */}

          {/* Layout Đăng ký Shop */}
          <Route path="registe-shop" element={<RegisterShopLayout />}>
            <Route index element={<ShopRegister />} />
          </Route>
        </Routes>

      </Suspense>
    </>
  );

}

export default App;
