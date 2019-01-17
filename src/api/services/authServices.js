import InternalServerError from "../errors/InternalServerError";
import LdapClient from "promised-ldap";
import {getRandomString} from "../../utils/cryptoUtils";
import {generateToken} from "../../utils/authUtils";
import AuthFailedError from "../errors/AuthFailedError";

export default (database, logger) => {
  const {User} = database.models;

  return {
    async createUser({username}) {
      try {
        const secret = getRandomString(16);
        const user = await User.create({
          username,
          secret
        });

        return user;
      } catch (error) {
        throw error;
      }
    },

    async login({username, password}) {
      try {
        if (!password) {
          throw new InternalServerError();
        }

        const client = new LdapClient({
          url: "ldap://test.local" // Here comes the domain
        }); // We are creating our LDAP client

        await client.bind(username, password); // Here's authentication with LDAP

        let userRecord = await User.findOne({username});

        if (!userRecord) {
          // Here we checks if user is already in our DB
          userRecord = await this.createUser({username}); // if not, we are creating a record
        }

        const token = generateToken({
          // and finally we can generate token based on individual user secret
          id: userRecord._id,
          secret: userRecord.secret
        });

        return token;
      } catch (error) {
        logger.log(error);
        throw new AuthFailedError("Auth failed");
      }
    }
  };
};
