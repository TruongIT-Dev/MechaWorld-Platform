import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

// import router
import {
  HomePage,
  ProductPage,
  SignIn,
  ProfilePage,
  UserProfile,
  TradeHistory,
  OrderHistory,
  AuctionHistory,
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
  AddCollection,
  ShopAddress,
  PageNotFound,
  ExchangeList,
  ExchangeManage,
  ExchangeMyPost,
  CollectionContainer,
  GundamCollectionApp,
  NotificationPage,

} from "./routes/router";

import { verifyToken } from "./apis/Authentication/APIAuth";
import { logout, updateUser } from "./features/auth/authSlice";

import Spinner from "./components/Spinner";
import PageLoading from "./components/PageLoading";

import { restoreDeliveryFees } from "./features/exchange/middleware/deliveryFeePersistence";

import { db } from './features/notification/firebase-config'
import { collection, getDocs } from 'firebase/firestore'



function App() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Lấy thông tin người dùng từ Redux

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      verifyToken(accessToken).then((userData) => {
        if (userData) {
          dispatch(updateUser(userData.data));
          dispatch(restoreDeliveryFees());
        } else {
          dispatch(logout());
        }
      });
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'notifications'))
        console.log('Firebase connected successfully!')
        console.log('Documents count:', querySnapshot.size)
      } catch (error) {
        console.error('Firebase connection error:', error)
      }
    }

    testConnection()
  }, [])

  // Phân quyền dựa trên vai trò
  const ProtectedRoute = ({ children }) => {
    if (user?.role === "moderator" || user?.role === "admin") {
      return <Navigate to="/moderator" replace />;
    }
    return children; // Nếu không phải moderator/admin, hiển thị nội dung bình thường
  };

  return (
    <>
      <PageLoading /> {/* Hiệu ứng loading khi chuyển trang */}
      <Suspense fallback={<Spinner />}> {/* Loading khi tải component */}
        <Routes>
          {/* Route màn hình role Member & Shop */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />

            {/* Product Route */}
            <Route path="product" element={<ProductPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            

            {/* Notification */}
            <Route path="notifications" element={<NotificationPage />} />
            

            {/* Aution Route */}
            <Route path="auction" element={<AutionList />} />
            <Route path="auction/:auctionID" element={<AutionDetail />} />



            {/* Exchange Main Route */}
            <Route path="/exchange" element={<ExchangePage />}>
              <Route path="list" element={<ExchangeList />} />
              <Route path="manage-gundam" element={<ExchangeGundamManagement />} />
              <Route index element={<ExchangeList />} />
            </Route>

            {/* Exchange side Route */}
            <Route path="/exchange/manage" element={<ExchangeManage />} />
            <Route path="/exchange/my-post" element={<ExchangeMyPost />} />
            <Route path="/exchange/detail/:id" element={<ExchangeDetailInformation />} />


            {/* Collection Route */}
            <Route path="collection" element={<GundamCollectionApp />} >
              <Route path="list" element={<CollectionContainer />} />
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
              <Route path="auctionHistory" element={<AuctionHistory />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="address-setting" element={<SettingAddress />} />
            </Route>


            {/* Shop Route */}
            <Route path="shop" element={<ShopPage />}>
              <Route path="dashboard" element={<ShopDashboard />} />
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

          {/* Login & Signup */}
          <Route path="member">
            <Route path="login" index element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          {/* Layout Đăng ký Shop */}
          <Route path="registe-shop" element={<RegisterShopLayout />}>
            <Route index element={<ShopRegister />} />
          </Route>


          {/* Những Route cho màn hình Moderator & Admin khác */}
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


        </Routes>
      </Suspense>
    </>
  );

}

export default App;
