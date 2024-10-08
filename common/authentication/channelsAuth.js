const CommonHeaders = require("../model/header");
const APIError = require("../model/apiError");
const errorCode = require("../../common/resources/errorCodes.json");
const config = require('config')
const ServicesAuthorizationJson = config.get("channels");





const authenticate = (req) => {

  this.commonHeader = new CommonHeaders(
    req.headers["x-channel-id"],
    req.headers["x-sub-channel-id"],
    req.headers["x-req-id"],
    req.headers["x-country-code"]
  );

  const headerValidationResponse = this.commonHeader.validateSchema();

  if (headerValidationResponse.error) {


    return new APIError(

      errorCode.validationFailed.code,
      headerValidationResponse.error.details[0].message,
      this.commonHeader.xReqId,
      "Middleware",
      headerValidationResponse.error.details[0].context.key,
      errorCode.validationFailed.code,
      headerValidationResponse.error.details[0].message,

    );

  }
  return authenticateChannel(
    this.commonHeader.xChannelId,
    req.route.path,
    this.commonHeader.xReqId,
    this.commonHeader.xSubChannelId
  );
};



const authenticateChannel = (channel, apiUrl, reqId, subChannel) => {

  const channelObj = ServicesAuthorizationJson.find(
    (row) => row.url === apiUrl
  );


  const allowedChannelsArray = channelObj.allowedChannels;


  if (allowedChannelsArray.indexOf(channel) === -1) {


    return new APIError(
      errorCode.unauthorized.code,
      errorCode.unauthorized.message,
      reqId,
      "Middleware",
      "",
      errorCode.unauthorized.code,
      errorCode.unauthorized.message,
    );
  }
};

module.exports = {
  authenticate: authenticate,
};
