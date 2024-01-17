var express = require("express");
var router = express.Router();

/* GET health check. */
router.get("/", function (req, res, next) {
  res.send(new Date());
});

module.exports = router;
