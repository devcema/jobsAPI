const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  //default
  const customError = {
    statusCode: err.statusCode || StatusCodes.OK,
    msg: err.message || "Something went wrong try again later",
  };

  // console.log(err);
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  if (err.code && err.code === 11000) {
    customError.msg = `${Object.keys(
      err.keyValue
    )} already exists, please choose another one`;
    customError.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");

    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found for id : ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });

  // return res.status(500).json({ err });
};

module.exports = errorHandlerMiddleware;
