const querystring = require("querystring");
const axios = require("axios");
const User = require("../models/userModel");
const URL = require("url");
const generateToken = require("../config/generateToken");

const getGoogleAuthURL = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${process.env.SERVER_ROOT_URI}/auth/google`,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  return `${rootUrl}?${querystring.stringify(options)}`;
};

const getGoogleTokens = (code) => {
  /*
  Returns:
  Promise<{
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }>
  */
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${process.env.SERVER_ROOT_URI}/auth/google`,
    grant_type: "authorization_code",
  };

  return axios
    .post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });
};

const getGoogleUser = async (req, res) => {
  try {
    const code = req.query.code;

    const { id_token, access_token } = await getGoogleTokens(code);

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data);
    let user = await User.findOne({
      $or: [{ googleId: googleUser.id }, { email: googleUser.email }],
    });
    if (!user) {
      const username = googleUser.email.slice(0, googleUser.email.indexOf("@"));
      const randomPwd = username + "#" + Math.floor(Math.random() * 9999999);
      user = await User.create({
        googleId: googleUser.id,
        fullname: googleUser.name,
        username,
        email: googleUser.email,
        password: randomPwd,
        pic: googleUser.picture || "",
      });
    }
    userObj = {
      success: true,
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    };

    const queryParams = new URLSearchParams(userObj).toString();
    res.redirect(process.env.UI_ROOT_URI + "/oauth_validate?" + queryParams);
  } catch (err) {
    console.log(`Unable to fetch user google profile, Error: ${err.message}`);
    // res.status(404).send()
  }
};

module.exports = { getGoogleAuthURL, getGoogleUser };
