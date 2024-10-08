const CommonDebugLoggerInstance = require("../../../../common/utils/logger/logger");
const config = require("config");

class ClientRequest {
  constructor(commonHeaders) {
    this.commonHeaders = commonHeaders;
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "request.js"
    );
    this.logger.debug({
      method: "ClientRequest Constructor",
      message: "ClientRequest Object Requested",
    });
  }

  getPayloadRequestMysis(data, headers) {
    try {
      this.logger.debug(
        "ClientRequest getPayloadRequest method invoked with parameters :",
        data
      );

      this.logger.debug(
        "MB channel request is going to transform : ",
        data.headers.xChannelId
      );
      let method = config.get("api.misysURL.customer.v1.method");
      let url = config.get("api.misysURL.customer.v1.url");
      let queryString = null;
      //Developer's Responsibility
      this.logger.debug(
        "ClientRequest getPayloadRequest method invoked with parameters :",
        data
      );
      let paramObj = {
        INPUTPARM: {},
      };

      if (method == "GET") {
        queryString = Object.entries(paramObj)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");
      }

      return {
        headers: { CNIC: data.body.cnic },
        method: method,
        url: method == "GET" ? `${url}?${queryString}` : url,
        data: method == "GET" ? {} : paramObj,
      };
    } catch (error) {
      throw error;
    }
  }

  getPayloadRequestTransact(data, headers) {
    try {
      this.logger.debug(
        "ClientRequest getPayloadRequest method invoked with parameters :",
        data
      );

      this.logger.debug(
        "MB channel request is going to transform : ",
        data.headers.xChannelId
      );

      let paramObj = {
        cnic: data.body.cnic,
      };
      let modifiedHeaders = {
        "Content-Type": "application/json",
        "x-channel-id": "MB",
        "x-country-code": "PK",
        "x-req-id": "00001090",
        "x-sub-channel-id": "MB",
        Authorization: config.get("api.temenos.customer.v1.Authorization"),
        Cookie: config.get("api.temenos.customer.v1.Cookie"),
      };

      return {
        headers: modifiedHeaders,
        paramObj: paramObj,
        method: config.get("api.temenos.customer.v1.method"),
        url: config.get("api.temenos.customer.v1.url"),
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ClientRequest;
