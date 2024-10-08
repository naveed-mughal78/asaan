// Manage ResCurrencyRatesValidationModel class according to service

class ResEtbNtbModel {
  constructor(OutData, pathParams, customerType) {
    this.ETBNTBFLAG = OutData.ETBNTBFLAG;
    this.ATA = OutData.ATA;
    this.CIFNO = OutData.CIFNO;
    this.CUSTTYPE = OutData.CUSTTYPE;
    this.CUSTSEGMENT = OutData.CUSTSEGMENT;
    this.CUSTNAME = OutData.CUSTNAME;
    this.CUSTMOBILE = OutData.CUSTMOBILE;
    this.CIFSTATUS = OutData.CIFSTATUS;
    this.REMEDIATE = OutData.REMEDIATE;
    this.RESPCODE = OutData.RESPCODE;
    this.RESPDESC = OutData.RESPDESC;
  }
}

class Res_Transact_Model {
  constructor(OutData, pathParams, customerType) {
    this.responseCode = OutData.data.responseCode;
    this.ATA = OutData.data.responseDescription.ATA;
    this.CIFNO = OutData.data.responseDescription.CIFNO;
    this.CIFSTATUS = OutData.data.responseDescription.CIFSTATUS;
    this.CUSTMOBILE = OutData.data.responseDescription.CUSTMOBILE;
    this.CUSTNAME = OutData.data.responseDescription.CUSTNAME;
    this.CUSTSEGMENT = OutData.data.responseDescription.CUSTSEGMENT;
    this.CUSTTYPE = OutData.data.responseDescription.CUSTTYPE;
    this.ETBNTBFLAG = OutData.data.responseDescription.ETBNTBFLAG;
    this.REMEDIATE = OutData.data.responseDescription.REMEDIATE;
    this.RESPCODE = OutData.data.responseDescription.RESPCODE;
    this.RESPDESC = OutData.data.responseDescription.RESPDESC;
  }
}

module.exports = { ResEtbNtbModel, Res_Transact_Model };
