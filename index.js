require("babel-register");

require("./src/App")({
  SERVER_PORT: 3000,
  SERVER_HOST: "localhost",
  DB_HOST: "localhost",
  DB_PORT: 27017,
  DB_NAME: "authLDAP"
});
