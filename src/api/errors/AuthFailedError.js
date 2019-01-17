class AuthFailedError extends Error {
  errorCode = 105;
  httpStatus = 401;
  userMessage = "Authentication Failed";
}

export default AuthFailedError;
