import React from "react";

// Lazy load các component
export const Home = React.lazy(() => import('../pages/Home'));
export const About1 = React.lazy(() => import("../pages/About1"));
export const Courses1 = React.lazy(() => import("../pages/Courses1"));
export const Team1 = React.lazy(() => import("../pages/Team1"));
export const Testimonial1 = React.lazy(() => import("../pages/Testimonial1"));
export const Contact1 = React.lazy(() => import("../pages/Contact1"));

export const ErrorPage = React.lazy(() => import("../components/ErrorPage"));
export const SignUp = React.lazy(() => import("../components/Register"));
export const Profile = React.lazy(() => import("../components/Profile"));
export const FeedbackAll = React.lazy(() => import("../components/FeedbackAll"));

export const Javaprog = React.lazy(() => import("../components/Course/Javaprog"));
export const Dsa = React.lazy(() => import("../components/Course/Dsa"));
export const Mern = React.lazy(() => import("../components/Course/Mern"));
export const Fullstack = React.lazy(() => import("../components/Course/Fullstack"));
export const Programming = React.lazy(() => import("../components/Course/Programming"));
export const Product1 = React.lazy(() => import("../pages/Product1"));