const config = require("config");
const Client = require("../../../connector/client");
const ClientRequest = require("./transformation/request");
const ClientResponse = require("./transformation/response");
const CommonDebugLoggerInstance = require("../../../common/utils/logger/logger");
const GlobalState = require("../../../config/global");

class ClientService {
  constructor(client_name, commonHeaders) {
    this.commonHeaders = commonHeaders;
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "clientService.js"
    );

    this.logger.debug({
      method: "ClientService Constructor",
      message: "ClientService Object Requested with ",
      client_name,
    });

    this.client = new Client(client_name, {}, this.commonHeaders);
  }

  async perform(apiRequest) {
    let logger = (data) =>
      this.logger.debug({
        ...data,
      });
    logger({
      method: "ClientService().perform()",
      message: "ClientService perform method invoked with parameters : ",
      apiRequest: apiRequest,
    });

    //! METHODS
    //! CHECK THE CONFIGS AS PER TARGET SOURCE

    const getPayloadConfiguration = (RequestBodySource, payload) => {
      let url =
        RequestBodySource === "M"
          ? config.get("api.misysURL.customer.v1.url")
          : config.get("api.temenos.customer.v1.url");
      let method =
        RequestBodySource === "M"
          ? config.get("api.misysURL.customer.v1.method")
          : config.get("api.temenos.customer.v1.method");
      let headers =
        RequestBodySource === "M" ? apiRequest.headers : apiRequest.headers;
      let payloadBody = RequestBodySource === "M" ? payload : payload;

      return {
        headers,
        payloadBody,
        method,
        url,
      };
    };

    const handleMysisRequest = async () => {
      return {
        responseCode: "00",
        O_RESPONSE: {
          O_CNIC: "4130458458069",
          O_ETBNTBFLAG: "C",
          O_ATA: "N",
          O_CIFNO: "CEJQVB",
          O_TYPE: "EA",
          O_SEGMENT: "A6",
          O_NAME: "MUHAMMAD ALI NAWAZ",
          O_MOBILE: "03463835468",
          O_STATUS: "N",
          O_REMEDIATE: "N",
        },
        O_MESSAGE: {
          O_CODE: "",
          O_DESC: "Customer Found in MISYS - MOCK RESPONSE",
        },
      };

      // return null; //! currently mysis payload is not confirmed from Aamir Ali. need cURL to verify
      let payload = clientRequest.getPayloadRequestMysis(
        apiRequest,
        this.commonHeaders
      );

      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message: "ClientRequest Generated Payload Request etbNtb V1",
        payload: payload,
      });

      //! EXTRACT THE CONFIGS AS PER TARGET SOURCE

      const { method, url, payloadBody } = getPayloadConfiguration(
        "M",
        payload
      );

      //! EXECUTE THE REQUEST
      const result = await this.client.performRestRequest(
        this.commonHeaders,
        payloadBody.data,
        method,
        url
      );

      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message: "Client Recieved Response from MISYS etbNtb V1",
        result: result,
      });

      //! COMMENTED FOR NOW
      // if (result?.OT.O_RESCODE !== "00000") {
      //   return {
      //     error: {
      //       code: result.OT.O_RESCODE,
      //       message: result.OT.O_RESMESSAGE,
      //     },
      //   };
      // }
      if (result.error) {
        return {
          error: {
            code: result.OT.O_RESCODE,
            message: result.OT.O_RESMESSAGE,
          },
        };
      }
      const clientResponse = new ClientResponse(this.commonHeaders);

      //! GET PAYLOAD RESPONSE
      return clientResponse.getPayloadResponse(this.commonHeaders, result);
    };
    const handleTransactRequest = async () => {
      let payload = clientRequest.getPayloadRequestTransact(
        apiRequest,
        this.commonHeaders
      );

      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message:
          "ClientRequest Generated Payload Request Aasan Account Validation V1",
        payload: payload,
      });

      //! EXTRACT THE CONFIGS AS PER TARGET SOURCE

      const { method, url, payloadBody } = getPayloadConfiguration(
        "T",
        payload
      );

      //! EXECUTE THE REQUEST
      const result = await this.client.performRestRequest(
        payloadBody.headers,
        payloadBody.paramObj,
        method,
        url
      );

      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message:
          "Client Recieved Response from MISYS Aasan Account Validation V1",
        result: result,
      });

      if (result.error) {
        return {
          error: {
            code: result.error.responseCode,
            message: result.error.responseDescription,
          },
        };
      }
      const clientResponse = new ClientResponse(this.commonHeaders);

      //! GET PAYLOAD RESPONSE
      return clientResponse.getPayloadResponseTransact(
        this.commonHeaders,
        result
      );
    };

    const clientRequest = new ClientRequest(this.commonHeaders);

    // // const payload = clientRequest.getPayloadRequest(apiRequest)
    // const payload =
    //   // GlobalState.state.isTransact === false // CHECK GLOBAL CONDITION
    //   clientRequest.getPayloadRequestMysis(apiRequest, this.commonHeaders);
    // // ?
    // // : clientRequest.getPayloadRequestTransact(
    // // apiRequest,
    // // this.commonHeaders
    // // );

    // this.logger.debug({
    //   method: "ClientService().perform",
    //   message: "ClientRequest Generated Payload Request FT RTGS V1",
    //   payload: payload,
    // });

    // let result = "";
    // if (GlobalState.state.isTransact == false) {
    //   result = await this.client.performRestRequest(
    //     payload.headers,
    //     payload.paramObj,
    //     payload.method,
    //     payload.url
    //   );
    // } else {
    //   result = await this.client.performRestRequest(
    //     payload.headers,
    //     payload.paramObj,
    //     payload.method,
    //     payload.url
    //   );
    // }
    // console.log(result);
    // this.logger.debug({
    //   method: "ClientService.perform()",
    //   message: "Client Recieved Response from MISYS  FT V1",
    //   result: result,
    // });

    // if (result.error) {
    //   return result;
    // }

    // const clientResponse = new ClientResponse(this.commonHeaders);

    // return clientResponse.getPayloadResponse(apiRequest.headers, result);
    //! VARIABLES
    let coexistenceFlag = config.get("coexistenceFlag");
    let RequestBodySource = apiRequest.body.sourceSystem;

    if (coexistenceFlag) {
      //! IF COEXISTENCE => TRUE
      if (RequestBodySource === "T") {
        //! TRANSACT AND MYSIS

        //! 1. MYSIS
        // let misysResult = await handleMysisRequest();
        //! 2. TRANSACT
        let transactResult = await handleTransactRequest();

        //! IN TRANSACT CASE => TRUE
        GlobalState.addGlobalState({ isTransact: true });
        //! IF BOTH HAVE SUCCESS CASE
        return transactResult;

        //   if (misysResult?.error && transactResult?.error) {
        //     //! IN TRANSACT CASE => TRUE
        //     GlobalState.addGlobalState({ isTransact: true });
        //     return transactResult;
        //   } else if (
        //     transactResult?.responseCode === "00000" &&
        //     misysResult?.error
        //   ) {
        //     //! IN TRANSACT CASE => TRUE
        //     GlobalState.addGlobalState({ isTransact: true });
        //     return transactResult;
        //   } else if (!misysResult?.error && transactResult?.error) {
        //     //! IN MYSIS CASE => FALSE
        //     GlobalState.addGlobalState({ isTransact: false });
        //     return misysResult;
        //   } else {
        //     //! IN TRANSACT CASE => TRUE
        //     GlobalState.addGlobalState({ isTransact: true });
        //     //! IF BOTH HAVE SUCCESS CASE
        //     return transactResult;
        //   }
        // } else {
        //   //! IN MYSIS CASE => FALSE
        //   GlobalState.addGlobalState({ isTransact: false });
        //   //! MYSIS ONLY IF SOURCE IS MYSIS
        //   return await handleMysisRequest();
        // }
      } else {
        //! IN MYSIS CASE => FALSE
        GlobalState.addGlobalState({ isTransact: false });
        //! MYSIS ONLY IF SOURCE IS MYSIS
        return await handleMysisRequest();
      }
    } else if (coexistenceFlag === false && RequestBodySource === "M") {
      return {
        error: {
          code: "400",
          message: "system not available transact is migrated",
        },
      };
    } else {
      //! IN TRANSACT CASE => TRUE
      GlobalState.addGlobalState({ isTransact: true });
      //! IF COEXISTENCE => FALSE
      //! ONLY TEMENOS/TRANSACT
      return await handleTransactRequest();
    }
  }
}

module.exports = ClientService;
