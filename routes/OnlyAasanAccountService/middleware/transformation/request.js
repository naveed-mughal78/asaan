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
        "ClientRequest getPayloadRequest method invoked with parameters Mysis Call:",
        data
      );

      this.logger.debug(
        "MB channel request is going to transform Mysis Call: ",
        data.headers.xChannelId
      );
      let method = config.get("api.misysURL.onlyAasanAccountMisys.v1.method");
      let url = config.get("api.misysURL.onlyAasanAccountMisys.v1.url");
      let queryString = null;
      //Developer's Responsibility
      this.logger.debug(
        "ClientRequest getPayloadRequest method invoked with parameters Mysis Call:",
        data
      );
      let paramObj = {
        "INPUTPARM": {
          "CNIC": data.body.cnic,
          "SEARCH_TYPE": data.body.SEARCH_TYPE
        },
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
        headers: { "Content-Type": "application/json", },
        method: method,
        url: method == "GET" ? `${url}?${queryString}` : url,
        data: paramObj,
      };
    } catch (error) {
      throw error;
    }
  }

  getPayloadRequestTransact(data, headers) {
    try {
      this.logger.debug(
        "ClientRequest getPayloadRequest method invoked with parameters Transact Call:",
        data
      );

      this.logger.debug(
        "MB channel request is going to transform Transact Call: ",
        data.headers.xChannelId
      );

      let paramObj = {
      };
      let modifiedHeaders = {
        companyId: "PK0029999",
        "Accept": "application/json",
        "product": "HBL.ASAAN",
        "cnic": data.body.cnic,
        Authorization: config.get("api.temenos.onlyAasanAccountTransact.v1.Authorization"),
        Cookie: config.get("api.temenos.onlyAasanAccountTransact.v1.Cookie"),
      };

      return {
        headers: modifiedHeaders,
        paramObj: paramObj,
        method: config.get("api.temenos.onlyAasanAccountTransact.v1.method"),
        url: config.get("api.temenos.onlyAasanAccountTransact.v1.url"),
      };
    } catch (error) {
      throw error;
    }
  }
  getPayloadRequestKonnect(data, headers) {
    try {
      this.logger.debug(
        "ClientRequest getPayloadRequest method invoked with parameters Konnect Call:",
        data
      );

      this.logger.debug(
        "MB channel request is going to transform Konnect Call: ",
        data.headers.xChannelId
      );

      let paramObj = {
        "cnic": data.body.cnic,

      };
      let modifiedHeaders = {
        "Accept": "application/json",
      };

      return {
        headers: modifiedHeaders,
        paramObj: paramObj,
        method: config.get("api.temenos.onlyAasanAccountKonnect.v1.method"),
        url: config.get("api.temenos.onlyAasanAccountKonnect.v1.url"),
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ClientRequest;
