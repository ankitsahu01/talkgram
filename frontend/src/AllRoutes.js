import { Routes, Route, Navigate } from "react-router-dom";
import Chatpage from "./pages/Chatpage";
import OAuthValidate from "./pages/OAuthValidate";
import Forgotpwd from "./pages/ForgotPwd";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/miscellaneous/Footer";
import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";

const AllRoutes = () => {
  const loggedUser = useSelector((state) => state.loggedUser);

  return (
    <Routes>
      <Route
        path="/"
        exact
        element={<Navigate replace to={loggedUser ? "/chat" : "/login"} />}
      />
      <Route
        path="/login"
        element={
          loggedUser ? (
            <Navigate replace to="/chat" />
          ) : (
            <>
              <Login /> <Footer />
            </>
          )
        }
      />
      <Route
        path="/signup"
        element={
          loggedUser ? (
            <Navigate replace to="/chat" />
          ) : (
            <>
              <Signup />
              <Footer />
            </>
          )
        }
      />
      <Route
        path="/chat"
        element={loggedUser ? <Chatpage /> : <Navigate replace to="/login" />}
      />
      <Route
        path="/oauth_validate"
        element={
          loggedUser ? <Navigate replace to="/chat" /> : <OAuthValidate />
        }
      />
      <Route
        path="/forgot-password"
        element={
          loggedUser ? (
            <Navigate replace to="/chat" />
          ) : (
            <>
              <Forgotpwd />
              <Footer />
            </>
          )
        }
      />
      <Route
        path="*"
        element={
          <>
            <NotFound /> <Footer />
          </>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
