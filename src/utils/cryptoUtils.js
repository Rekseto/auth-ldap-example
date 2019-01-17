import crypto from "crypto";

/**
 * Generates a random string of a given `length`.
 *
 * @param   {number}    length        Length of the random string to generate
 * @return  {string}                  Generated random string
 */
export function getRandomString(length = 32) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}
