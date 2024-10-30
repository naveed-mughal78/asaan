// Manage ResCurrencyRatesValidationModel class according to service

class AlreadyExistsModal {
  constructor(OutData, pathParams, customerType) {
    this.isExist = "Y",
      this.source = {
        Misys: OutData.misys === undefined ? false : true,
        Transact: OutData.transact === undefined ? false : true,
        Konnect: OutData.konnect === undefined ? false : true

      }
  }
}


class NotExistsModal {
  constructor(OutData, pathParams, customerType) {
    this.isExist = "N",
      this.source = {
        Misys: OutData.misys === undefined ? false : true,
        Transact: OutData.transact === undefined ? false : true,
        Konnect: OutData.konnect === undefined ? false : true

      }
  }
}


module.exports = { AlreadyExistsModal, NotExistsModal };
