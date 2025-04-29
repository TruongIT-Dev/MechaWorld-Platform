import React from "react";

// Lazy load các pages

// Layout
export const UserLayout = React.lazy(() => import('../pages/UserLayout'));
export const ModeratorLayout = React.lazy(() => import('../pages/ModeratorLayout'));

// Navigation Bar route
export const HomePage = React.lazy(() => import('../pages/HomePage'));
export const ProductPage = React.lazy(() => import('../components/Product/Product'));
export const ExchangePage = React.lazy(() => import('../components/Exchange/Exchange'));


// SignIn & SignUp - Authentication route
export const SignIn = React.lazy(() => import("../components/Login/SignIn"));
export const SignUp = React.lazy(() => import("../components/Login/SignUp"));


// Product Detail Page route
export const ProductDetailPage = React.lazy(() => import('../components/ProductDetail/ProductDetail'));


// Cart route
export const CartPage1 = React.lazy(() => import('../components/Cart/Carts'));


// Checkout route
export const Checkout = React.lazy(() => import('../components/Checkout/checkout'));


// wallet route
export const WalletPage = React.lazy(() => import('../components/Wallet/WalletUser'));


// Member Profile route
export const ProfilePage = React.lazy(() => import("../components/Profile/Profiles"));
export const UserProfile = React.lazy(() => import("../components/Profile/UserProfile"));
export const OrderHistory = React.lazy(() => import("../components/Profile/OrderHistory"));
export const TradeHistory = React.lazy(() => import("../components/Profile/TradeHistory"));
export const SettingAddress = React.lazy(() => import("../components/Profile/SettingAddress"));


// Register Shop route
export const ShopRegister = React.lazy(() => import("../components/RegisterShop/RegisterShop"));
export const RegisterShopLayout = React.lazy(() => import("../components/RegisterShop/RegisterShopLayout"));

// Shop route
export const ShopDashboard = React.lazy(() => import("../components/Shop/ShopDashboard"));
export const ShopAddress = React.lazy(() => import("../components/Shop/ShopAddress"));
export const ShopProductManagement = React.lazy(() => import("../components/Shop/ShopProductManagement"));
export const ShopPage = React.lazy(() => import("../components/Shop/ShopPage"));
export const ShopTransaction = React.lazy(() => import("../components/Shop/ShopTransaction"));
export const ShopAuctionManagement = React.lazy(() => import("../components/Shop/ShopAuctionManagement"));
export const ShopOrderManagement = React.lazy(() => import("../components/Shop/ShopOrderManagement"));
export const ShopReportManagement = React.lazy(() => import("../components/Shop/ShopReportManagement"));


// Exchange Route
export const ExchangeList = React.lazy(() => import("../components/Exchange/ExchangeList"));
export const ExchangeManage = React.lazy(() => import("../components/Exchange/ExchangeManage/ExchangeManage"));
export const ExchangeMyPost = React.lazy(() => import("../components/Exchange/ExchangeManageMyPost/ExchangeMyPost"));

export const ExchangeDetailInformation = React.lazy(() => import("../components/Exchange/ExchangeDetailInformation"));
export const ExchangeGundamManagement = React.lazy(() => import("../components/Exchange/ExchangeGundamManagement"));

// Aution route
export const AutionList = React.lazy(() => import("../components/Aution/User/AutionList"));
export const AutionDetail = React.lazy(() => import("../components/Aution/User/AutionDetail"));

// Collection route
export const Collection = React.lazy(() => import("../components/Collection/Collection"));

export const AddProductToAution = React.lazy(() => import("../components/Aution/shop/AddProductToAution"));
export const ListProductToAution = React.lazy(() => import("../components/Aution/shop/ListProductToAution"));

export const CensorProductToAution = React.lazy(() => import("../components/Aution/Moderator/CensorAution"));

// Moderator route
export const ModFeedbacks = React.lazy(() => import("../components/Moderator/ModFeedbacks"));
export const ModOrders = React.lazy(() => import("../components/Moderator/ModOrders"));
export const ModTransactions = React.lazy(() => import("../components/Moderator/ModTransactions"));
export const ModGundams = React.lazy(() => import("../components/Moderator/ModGundams"));
export const ModUsers = React.lazy(() => import("../components/Moderator/ModUsers"));
export const ModRefunds = React.lazy(() => import("../components/Moderator/ModRefunds"));
export const ModAuctions = React.lazy(() => import("../components/Moderator/ModAuctions"));
export const ModExchanges = React.lazy(() => import("../components/Moderator/ModExchanges"));



// 404 page route
export const PageNotFound = React.lazy(() => import("../components/Errors/PageNotFound"));


