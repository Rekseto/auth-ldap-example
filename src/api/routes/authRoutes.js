import compose from "koa-compose";
import controller, {get, post, del, put} from "inra-server-http/dest/router";
import authServices from "../services/authServices";

@controller("/auth")
export default class AuthRouter {
  constructor(dependencies) {
    this.database = dependencies.database;
    this.logger = dependencies.logger;

    this.authServices = authServices(this.database, this.logger);
  }

  @post("/login")
  async login(ctx) {
    try {
      const {username, password} = ctx.request.body;
      // We are getting 2 variables from the request body

      // In next step we are calling function from the authServices passing the username and password
      const data = await this.authServices.login({
        username,
        password
      });

      // everything's ok, here's your token mate
      ctx.body = {
        success: true,
        token: data
      };
    } catch (error) {
      // If function throwed error we throw it further
      throw error;
    }
  }

  @get("/verify", function() {
    return compose([this.isAuthorized()]);
  })
  async verify(ctx) {
    // Midleware did not throw any error
    ctx.body = {
      success: true
    };
  }
}
