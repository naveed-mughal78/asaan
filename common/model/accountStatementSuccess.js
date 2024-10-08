// Manage success class according to service
class AccStatemnetSuccess {
    constructor (response) {
     
      this.reqType = response.reqType;
      this.records = response.records;
      this.completeStatus = response.completeStatus;
      this.formatVersion = response.formatVersion;
      this.pageNo = response.pageNo;
      this.postingStartDate = response.postingStartDate;
      this.postingEndDate = response.postingEndDate;
      this.sortOrder = response.sortOrder;
      this.OutData = response?.outData;
    
       
     
    }
  }
  
  module.exports = AccStatemnetSuccess
  