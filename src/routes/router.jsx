import React from "react";

// Lazy load các pages

// Layout
export const UserLayout = React.lazy(() => import('../pages/UserLayout'));

// Navigation Bar route
export const HomePage = React.lazy(() => import('../pages/HomePage'));
export const AboutPage = React.lazy(() => import("../components/About/About"));
export const ProductPage = React.lazy(() => import('../components/Product/Product'));

// Detail Product route
export const ProductDetailPage = React.lazy(() => import('../components/ProductDetail/ProductDetail'));


// Cart route
export const CartPage = React.lazy(() => import('../components/Cart/Cart'));

// Profile route
export const ProfilePage = React.lazy(() => import("../components/Profile/Profiles"));
export const UserProfile = React.lazy(() => import("../components/Profile/UserProfile"));
export const OrderHistory = React.lazy(() => import("../components/Profile/OrderHistory"));
export const TradeHistory = React.lazy(() => import("../components/Profile/TradeHistory"));
export const Collection = React.lazy(() => import("../components/Profile/Collection"));
export const SettingAddress = React.lazy(() => import("../components/Profile/SettingAddress"));
export const AdvancedSetting = React.lazy(() => import("../components/Profile/AdvancedSetting"));
// Shop route
export const ShopDashboard = React.lazy(() => import("../components/Shop/ShopDashboard"));
export const ShopProductManagement = React.lazy(() => import("../components/Shop/ShopProductManagement"));
export const ShopPage= React.lazy(() => import("../components/Shop/ShopPage"));
export const ShopTransaction = React.lazy(() => import("../components/Shop/ShopTransaction"));


// Authentication route
export const SignIn = React.lazy(() => import("../components/Sign"));

// 404 page route
export const ErrorPage = React.lazy(() => import("../components/Error"));


