import middleware from "inra-server-http/dest/middleware";
import {extractToken, decodeToken} from "../../utils/authUtils";
import NotAllowedError from "../errors/NotAllowedError";
import jwt from "jsonwebtoken";
/**
 * A simple middleware which checks if the request is authorized (user is logged
 * in). Additionally, populates context with basic user informations for further
 * usage. Based on JSON Web Tokens.
 *
 * @module  middleware/isAuthorizedMiddleware
 * @class   isAuthorizedMiddleware
 * @throws  NotAllowedError
 *
 * @apiDefine       isAuthorizedMiddleware
 * @apiPermission   isAuthorized
 * @apiHeader       {string}  Authorization   User JSON Web Token
 *
 * @apiHeaderExample {json} Authorization header:
 *     Authorization: Bearer <Access Token>
 */

@middleware()
class isAuthorizedMiddleware {
  constructor({database}) {
    this.models = database.models;
  }

  /**
   * Tries to extract JWT token from header/query.
   *
   * @param  {Context}  ctx
   * @param  {Function} next
   * @return {Promise}
   */
  async before(ctx, next) {
    this.token = extractToken(ctx);

    if (!this.token) {
      throw new NotAllowedError("Cannot extract token from context");
    }
  }
  /**
   * Checks if provided JWT is valid and populates context with user data.
   *
   * @param  {Context}  ctx
   * @param  {Function} next
   * @return {Promise}
   */
  async handle(ctx, next) {
    const data = await this.fetchUser();
    const secret = `${data.secret}@secret`;

    return jwt.verify(this.token, secret, (error, decoded) => {
      if (error) {
        throw new NotAllowedError(error.message);
      }

      // Populate context with user data:
      ctx.state.user = data;
      ctx.state.jwt = decoded;

      return next();
    });
  }

  /**
   * Extracts basic user data from database for further usage.
   *
   * @return {Promise|Object}
   */
  async fetchUser() {
    try {
      const {User} = this.models;
      const {payload} = decodeToken(this.token);

      return User.findOne({
        _id: payload.id
      });
    } catch (error) {
      return {};
    }
  }
}

export default isAuthorizedMiddleware;
