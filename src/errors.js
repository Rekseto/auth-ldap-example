import errors, {defineError} from "inra-server-error";

import NotFound from "./api/errors/NotFoundError";
import InternalServerError from "./api/errors/InternalServerError";
import NotAllowedError from "./api/errors/NotAllowedError";
import AuthFailedError from "./api/errors/AuthFailedError";

defineError({instance: NotFound}, "NotFoundError");
defineError({instance: InternalServerError}, "InternalServerError");
defineError({instance: AuthFailedError}, "AuthFailedError");
defineError({instance: NotAllowedError}, "NotAllowedError");

export default errors;
