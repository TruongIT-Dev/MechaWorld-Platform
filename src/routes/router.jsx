import React from "react";

// Lazy load các pages

// Navigation Bar
export const HomePage = React.lazy(() => import('../pages/HomePage'));
export const AboutPage = React.lazy(() => import("../pages/AboutPage"));
export const ProductPage = React.lazy(() => import('../pages/ProductPage'));

// 404 page route
export const ErrorPage = React.lazy(() => import("../pages/ErrorPage"));

// Account route
export const ProfilePage = React.lazy(() => import("../pages/ProfilePage"));
export const UserProfile = React.lazy(() => import("../components/Profile/UserProfile"));
export const OrderHistory = React.lazy(() => import("../components/Profile/OrderHistory"));
export const TradeHistory = React.lazy(() => import("../components/Profile/TradeHistory"));
export const Collection = React.lazy(() => import("../components/Profile/Collection"));
export const Setting = React.lazy(() => import("../components/Profile/Setting"));

// Authentication route
export const SignIn = React.lazy(() => import("../components/Sign"));



