import React from "react";

// Lazy load các pages

// Navigation Bar
export const HomePage = React.lazy(() => import('../pages/HomePage'));
export const AboutPage = React.lazy(() => import("../pages/AboutPage"));
export const ProductPage = React.lazy(() => import('../pages/ProductPage'));

// 404 page
export const ErrorPage = React.lazy(() => import("../pages/ErrorPage"));

// Authentication page

// User page
export const Profile = React.lazy(() => import("../pages/ProfilePage"));


