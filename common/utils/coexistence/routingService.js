const Client = require("../../../connector/client");
const CommonHeaders = require("../../../common/model/header");
const APIError = require("../../../common/model/apiError");
const config = require("config");
const CoexistenceHeaders = require("./coexistenceHeader");
const CONSTANT = require("./constant");


/* ---------- Incoming Body Format ----------

---------- For Multiple Accounts ----------
[
  "80892099949396",
  "80892099949396",
]

---------- For Single Accounts ----------
[
  "80892099949396",
]
*/

async function routingService(headers, body) {
  try {
    const client = new Client("REST", {}, headers);

    const CoexistenceTransformedHeaders = new CoexistenceHeaders(headers);

    // TOKEN ISSUE
    CoexistenceTransformedHeaders["Authorization"] =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJKMk5oeWh1amlJQUsySWVOaVlabEY0UWxjSDVFOFZ2UCJ9.vfkRK7bvRW_XbSA8ef8c5_IXebghXiA9CYIv6U8S4I0";

    const result = await client.performRestRequestForMiddleware(
      CoexistenceTransformedHeaders,
      {
        branches: body,
      },
      config.get("api.routingService.v1.method"),
      config.get("api.routingService.v1.url")
    );

    if (result?.responseCode === 200) {
      if (result?.data?.length == 1) {
        const flag = result.data[0].coreType == CONSTANT.misys ? CONSTANT.isTransactFalse : CONSTANT.isTransactTrue;
        return flag;
      } else {
        return result;
      }
    } else {
      return result
    }
  } catch (err) {
    this.logger.debug({
      method: "Coexistence().catch()",
      message: "Coexistence Error While calling routingService API : ",
      response: err,
    });
    return result;
  }
}

module.exports = routingService;
