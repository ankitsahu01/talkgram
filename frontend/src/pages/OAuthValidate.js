import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "../stateFeatures/loggedUserSlice";

const OAuthValidate = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isValidToken = async (token) => {
    try {
      const res = await fetch("/auth/me", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) return true;
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const fetchUserInfo = async () => {
    const urlParams = new URLSearchParams(search);
    const userObj = Object.fromEntries(urlParams);
    if (
      userObj.success &&
      userObj.token &&
      (await isValidToken(userObj.token))
    ) {
      dispatch(setLoggedUser(userObj));
      return navigate("/chat");
    }
    toast.error("Unable to login!");
    return navigate("/");
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "brightness(80%)",
        }}
      >
        <CircularProgress />
      </Box>
    </>
  );
};

export default OAuthValidate;
