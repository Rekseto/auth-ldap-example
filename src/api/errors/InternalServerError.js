class InternalServerError extends Error {
  errorCode = 100;
  httpStatus = 500;
  userMessage = "Internal Server Error";
}

export default InternalServerError;
