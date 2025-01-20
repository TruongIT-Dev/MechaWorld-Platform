import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import Spinner from "../components/Spinner";
import ProfilePage from "../components/Profiles"
export default function Profile() {
  return (
    <>
      <Spinner />
      <Navbar />
      <ProfilePage />
      <Footer />
    </>
  );
}
