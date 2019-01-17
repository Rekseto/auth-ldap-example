class NotFound extends Error {
  errorCode = 101;
  httpStatus = 404;
  userMessage = "Resource not found";
}

export default NotFound;
