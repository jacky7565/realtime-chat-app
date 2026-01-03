import jwt from "jsonwebtoken";

const auth = (req, res, next) => {

  let secretKey = process.env.TOKEN_SECRET;
  let getToken=req.cookies.token
  console.log(getToken);
  // let authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith("Bearer")) {
  if(!getToken) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  // let token = authHeader.split(" ")[1];
  let checkToken = jwt.verify(getToken, secretKey,(error, decode) => {
    if (error) {
      if (error.name == "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: err.message,
      });
    }
    req.user = decode;
  });
  next();
};

export default auth;
