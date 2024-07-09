import jwt from "jsonwebtoken";

// Middleware untuk autentikasi
const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Tidak diizinkan, silahkan login kembali!",
    });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error(err);
    res.status(401).json({
      success: false,
      message: "Terjadi kesalahan saat memverifikasi token",
    });
  }
};

export default authMiddleware;
