const APIError = require("../../../common/model/apiError.js");
const APIResponse = require("../../../common/model/apiResponse.js");
const ClientService = require("../middleware/clientService.js");
const APIRequest = require("../../../common/model/apiRequest.js");
const ReqParamModel = require("../model/ReqEtbNtbModel.js");
const CommonDebugLoggerInstance = require("../../../common/utils/logger/logger.js");
const config = require("config");
const APISuccess = require("../../../common/model/apiSuccess.js");
const errorCode = require("../../../common/resources/errorCodes.json");
const resCode = require("../../../common/resources/teminosErrorCodes.js");
// const coexistence = require("../../../common/utils/coexistence/coexistence.js");
// const GlobalState = require("../../../config/global.js");

class Service {
  constructor(commonHeaders, body) {
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "currencyRatesValidationService.js"
    );

    this.commonHeaders = commonHeaders;
    this.ReqParamModel = new ReqParamModel(body);
  }

  async perform() {
    try {
      const headerValidationResponse = this.commonHeaders.validateSchema();

      this.logger.debug({
        method: "Service Perform",
        message: "Request Headers Validation Result",
        headerValidationResult: { error: headerValidationResponse.error },
      });

      if (headerValidationResponse.error) {
        this.logger.debug({
          method: "Service Perform",
          message: "Request Headers Validation Result",
          headerValidationResult: { error: headerValidationResponse.error },
        });

        return new APIError(
          errorCode.unauthorizedheader.code,
          headerValidationResponse.error.details[0].message,
          headerValidationResponse.value.xReqId,
          "Middleware",
          "",
          errorCode.unauthorizedheader.code,
          headerValidationResponse.error.details[0].message
        );
      }

      const bodyValidationResponse = this.ReqParamModel.validateSchema();

      if (bodyValidationResponse.error) {
        this.logger.debug({
          method: "Service Perform",
          message: "Request Headers Validation Result",
          bodyValidationResult: { error: bodyValidationResponse.error },
        });

        return new APIError(
          errorCode.validationFailed.code,
          bodyValidationResponse.error.details[0].message,
          this.commonHeaders.xReqId,
          "Middleware",
          bodyValidationResponse.error.details[0].context.key,
          errorCode.validationFailed.code,
          bodyValidationResponse.error.details[0].message
        );
      }
      //! COEXISTENCE BYPASSED IN NTB/ETB

      // const coexistenceValidation = await coexistence.Coexistence(
      //   this.commonHeaders,
      //   this.body
      // );

      // if (
      //   coexistenceValidation &&
      //   coexistenceValidation?.responseCode &&
      //   coexistenceValidation?.responseCode != 200
      // ) {
      //   return new APIError(
      //     coexistenceValidation.responseCode,
      //     coexistenceValidation.responseDescription,
      //     coexistenceValidation.xReqId,
      //     "Middleware",
      //     "",
      //     coexistenceValidation.responseCode,
      //     coexistenceValidation.responseDescription
      //   );
      // }

      // GlobalState.printGlobalState();
      // GlobalState.addGlobalState({ isTransact: coexistenceValidation });
      // GlobalState.printGlobalState();

      const apiRequest = new APIRequest(
        this.commonHeaders,
        this.ReqParamModel,
        {},
        {}
      );

      const clientService = new ClientService(
        config.get("api.misysURL.ntb-etb.v1.api_type"),
        this.commonHeaders
      );

      const response = await clientService.perform(apiRequest);
      this.logger.debug("Service Response", response);

      const resResult = response.responseCode;

      //! Changes made for both responses (T) - Coexistence
      const finalresponse = response?.error
        ? response.error
        : resCode[resResult];
      const { code, message } = finalresponse;

      // const responseCodes = resCode.etbNtb;
      // const finalresponse = responseCodes[resResult];
      // const { code, message } = finalresponse;

      // Extract message and code
      if (code == "200" || code == "00") {
        return new APIResponse(
          code,
          message,
          this.commonHeaders.xReqId,
          undefined,
          new APISuccess(
            this.commonHeaders.xReqId,
            code,
            response?.O_MESSAGE?.O_DESC ?? response?.RESPDESC
          ),
          {}
        );
      } else {
        return new APIError(
          code,
          message,
          this.commonHeaders.xReqId,
          undefined,
          "",
          code,
          message
        );
      }
    } catch (error) {
      this.logger.error({
        method: "ETBNTB.catch()",
        message:
          "Error while executing currency rate validation perform method",
        errorStack: error.stack,
      });
      return new APIError(
        errorCode.errorStack.code,
        errorCode.errorStack.message,
        this.commonHeaders.xReqId,
        "Middleware",
        "",
        errorCode.errorStack.code,
        errorCode.errorStack.message
      );
    }
  }
}

module.exports = Service;
