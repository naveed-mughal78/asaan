const router = require("express").Router();


const onlyAasanAccountController = require("./OnlyAasanAccountService/controllers/onlyAasanAccountController");



router.post("/onlyAasanAccount", onlyAasanAccountController.Controller);

const levelChange = require("../common/utils/logger/logger");
router.post("/levelChange", levelChange.changed);


module.exports = router;
