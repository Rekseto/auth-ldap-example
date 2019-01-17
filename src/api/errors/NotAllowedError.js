class NotAllowedError extends Error {
  errorCode = 101;
  httpStatus = 403;
  userMessage = "Not allowed";
}

export default NotAllowedError;
