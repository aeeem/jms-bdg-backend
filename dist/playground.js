"use strict";
const ErrorMessages = {
    E_SOMETHING: { message: "Something", status: 500 },
    E_NOT_FOUND: { message: "Not found", status: 404 },
    E_FORBIDDEN: { message: "Forbidden", status: 403 },
};
const isHandledError = (code) => {
    return code in ErrorMessages;
};
const isErrorInstance = (err) => {
    return err instanceof Error;
};
const isCustomError = (err) => {
    return err !== undefined;
};
const handler = (err) => {
    if (isHandledError(err)) {
        let code = err;
        return ErrorMessages[code];
    }
    else if (isErrorInstance(err)) {
        return err;
    }
    else if (isCustomError(err)) {
        return err;
    }
    else {
        return { message: "Something went wrong", status: 500 };
    }
};
const valHandled = ErrorMessages.E_FORBIDDEN;
const valErrInst = new Error("ini dari error instance");
const valCustomE = { message: "ini dari custom error", status: 500 };
console.log(handler(valHandled));
console.log(handler(valErrInst));
console.log(handler(valCustomE));
