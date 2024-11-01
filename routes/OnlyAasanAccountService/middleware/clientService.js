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




    const handleMysisRequest = async () => {

      let payload = clientRequest.getPayloadRequestMysis(
        apiRequest,
        this.commonHeaders
      );

      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message: "ClientRequest Generated Payload Request onlyAasanAccount V1",
        payload: payload,
      });


      //! EXECUTE THE REQUEST
      const result = await this.client.performRestRequest(
        payload.headers,
        payload.data,
        payload.method,
        payload.url
      );

      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message: "Client Recieved Response from MISYS onlyAasanAccount V1",
        result: result,
      });
      if (result?.error || result?.error?.responseCode === 404) { //! Check if server is down 
        return {
          error: {
            code: result.error.responseCode,
            message: result?.error?.responseDescription,
          },
        };
      }
      if (result.OUTPUTPARM.REPCODE === "R") {
        // Not have account
        // Proceed further
        return {
          error: {
            code: result.OUTPUTPARM.REPCODE,
            message: result.OUTPUTPARM.REPMESSAGE,
          },
        };
      }
      const clientResponse = new ClientResponse(this.commonHeaders);

      //! GET PAYLOAD RESPONSE
      return clientResponse.getPayloadResponseMysis(this.commonHeaders, result);
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
          "ClientRequest Generated Payload Request onlyAasanAccount V1",
        payload: payload,
      });

      //! EXECUTE THE REQUEST
      const result = await this.client.performRestRequest(
        payload.headers,
        payload.paramObj,
        payload.method,
        payload.url
      );
      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message:
          "Client Recieved Response from Transact onlyAasanAccount V1",
        result: result,
      });


      if (result?.error?.responseCode === 404) { //! Check if server is down or path not found!
        return {
          error: {
            code: result.error.responseCode,
            message: result?.error?.responseDescription,
          },
        };
      }
      else if (result?.error || result?.body[0]?.isExist === "N") {

        return {
          error: {
            code: result?.error?.responseCode === "E-124540" ? "N" : result?.body[0]?.isExist,
            message: result?.error?.responseDescription ?? result?.header?.status,
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

    const handleKonnectRequest = async () => {
      let payload = clientRequest.getPayloadRequestKonnect(
        apiRequest,
        this.commonHeaders
      );

      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message:
          "ClientRequest Generated Payload Request onlyAasanAccount V1",
        payload: payload,
      });


      //! EXECUTE THE REQUEST
      const result = await this.client.performRestRequest(
        payload.headers,
        payload.paramObj,
        payload.method,
        payload.url
      );

      //! LOG THE PAYLOAD
      logger({
        method: "ClientService().perform",
        message:
          "Client Recieved Response from Konnect onlyAasanAccount V1",
        result: result,
      });

      if (result?.error || result?.error?.responseCode === 404) { //! Check if server is down 
        return {
          error: {
            code: result.error.responseCode,
            message: result?.error?.responseDescription,
          },
        };
      }
      if (result.ADA_Account_Exisits === "F") {
        return {
          error: {
            code: result.ADA_Account_Exisits,
            message: result.Response_Message,
          },
        };
      }
      const clientResponse = new ClientResponse(this.commonHeaders);

      //! GET PAYLOAD RESPONSE
      return clientResponse.getPayloadResponseKonnect(
        this.commonHeaders,
        result
      );
    };

    const clientRequest = new ClientRequest(this.commonHeaders);


    //! VARIABLES
    let coexistenceFlag = config.get("coexistenceFlag");

    if (coexistenceFlag) {
      //! IF COEXISTENCE => TRUE
      //! TRANSACT AND MYSIS CALL

      //! 1. MYSIS
      let misysResult = await handleMysisRequest();

      let transactResult;
      let konnectResult;

      if (misysResult.error) {// IF NOT EXIST THEN IT WILL BE CONSIDERED ERROR 
        //! 2. TRANSACT
        transactResult = await handleTransactRequest();
        if (transactResult.error) {
          //! 3. KONNECT
          konnectResult = await handleKonnectRequest();
        }
      }




      console.log("misysResult", misysResult);
      console.log("transactResult", transactResult);
      console.log("konnectResult", konnectResult);



      logger({
        method: "ClientService().perform",
        message:
          "Client Response Transforming Both Mysis and Transact Responses",
        payload: { ...misysResult, ...transactResult, ...konnectResult },
      });

      const clientResponse = new ClientResponse(this.commonHeaders);
      if (misysResult?.error?.code === 404 || transactResult?.error?.code === 404 || konnectResult?.error?.code === 404) {
        //! IF ANY SERVER IS DOWN/ERROR
        return clientResponse.serverDownORNotFound({ misys: misysResult, transact: transactResult, konnect: konnectResult });
      }
      //! TRANSFORMING BOTH MYSIS AND TRANSACT RESULT
      else if (misysResult?.error && transactResult?.error && konnectResult?.error) {
        return clientResponse.notExistPayload({ misys: misysResult, transact: transactResult, konnect: konnectResult });
      } else {
        return clientResponse.alreadyExistPayload({ misys: misysResult, transact: transactResult, konnect: konnectResult });
      }
    } else {
      //! MISYS AND KONNECT CALL

      //! 1. MYSIS
      let misysResult = await handleMysisRequest();

      let konnectResult;

      if (misysResult.error) {// IF NOT EXIST THEN IT WILL BE CONSIDERED ERROR 

        //! 2. KONNECT
        konnectResult = await handleKonnectRequest();
      }



      logger({
        method: "ClientService().perform",
        message:
          "Client Response Transforming Both Mysis and Transact Responses",
        payload: { ...misysResult, ...konnectResult },
      });

      const clientResponse = new ClientResponse(this.commonHeaders);
      if (misysResult?.error?.code === 404 || konnectResult?.error?.code === 404) {
        //! IF ANY SERVER IS DOWN/ERROR
        return clientResponse.serverDownORNotFound({ misys: misysResult, transact: null, konnect: konnectResult });
      }
      //! TRANSFORMING BOTH MYSIS AND TRANSACT RESULT
      else if (misysResult?.error && konnectResult?.error) {
        return clientResponse.notExistPayload({ misys: misysResult, transact: null, konnect: konnectResult }, false);//! False=>Transact will not work
      } else {
        return clientResponse.alreadyExistPayload({ misys: misysResult, transact: null, konnect: konnectResult }, false); //! False=>Transact will not work
      }


    }
  }
}

module.exports = ClientService;
