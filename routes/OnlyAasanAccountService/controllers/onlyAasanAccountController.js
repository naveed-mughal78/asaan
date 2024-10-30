const CommonHeaders = require("../../../common/model/header");
const Service = require("../services/OnlyAasanAccountService");
const CommonDebugLoggerInstance = require("../../../common/utils/logger/logger");
const Authenticator = require("../../../common/authentication/channelsAuth");

//
/**
 * Use PascalConvention for Class Naming ie. ClassName\
 *
 * Logger Intialization for class
 * const logger = CommonDebugLoggerInstance.CommonDebugLogger(commonHeaders,"stopChequeController.js")
 * @param {Object} commonHeaders
 * @param {string} filename
 *
 * How to use logger
 * logger.debug({methodName:"InController",message:"Service Object Created Successfully!!!",param:param})
 * @param {string} methodName
 * @param {string} message
 * @param {any} param
 *
 *
 */

const Controller = function (req, res) {
  const authRes = Authenticator.authenticate(req);

  if (authRes || authRes == "Unauthorized") {
    res.status(400);
    return res.send(authRes);
  }

  const commonHeaders = new CommonHeaders(
    req.headers["x-channel-id"],
    req.headers["x-sub-channel-id"],
    req.headers["x-req-id"],
    req.headers["x-country-code"],
    req.headers["x-endpoint"]
  );

  const logger = CommonDebugLoggerInstance.CommonDebugLogger(
    commonHeaders,
    "currencyRatesValidationController.js"
  );

  let service = new Service(commonHeaders, req.body);

  logger.debug({
    methodName: "InController",
    message: "Service Object Created Successfully!!!",
  });

  service
    .perform()
    .then(async (result) => {
      logger.debug({
        methodName: "perform",
        message: "Result From service",
        result: result,
      });

      // handle according to result response
      const responseCode = result.responseCode == "00" ? 200 : 400;
      return res.status(responseCode).json(result);
    })
    .catch((error) => {
      logger.error(
        { errorStack: error.stack },
        "Error in onlyAasanAccount API V1 Controller while serving client request"
      );

      logger.debug(
        { statusCode: 500, responseController: error.stack },
        "In Conroller Response  onlyAasanAccount API V1"
      );

      return res.status(400).json({ error: error.stack });
    });

  return res;
};

module.exports = {
  Controller: Controller,
};
