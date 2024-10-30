const express = require("express");
const app = express();
const config = require("./config/default.json");
const https = require("https");
const routes = require("./routes/router.js");
const serverlogger = require("./common/utils/logger/logger")
  .pinoInstance()
  .child({ fileName: "Server.js" });
const loggerMiddleware = require("./loggerMiddleware");
const fs = require("fs");
const checkAndUpdateData = require("./config/db/dataFetch");

//When connect with database to uncommit this function


// checkAndUpdateData();

const SERVICE_PORT = config.PORT;
const SERVICE_PORTHTTPS = config.PORTHTTPS;


app.use(loggerMiddleware);
app.use(express.json());

app.use("/api", routes);

app.use((req, res) => {
  res.sendStatus(404);
});

const options = {
  cert: fs.readFileSync("./certificate/certificate.crt", "utf8"),
  key: fs.readFileSync("./certificate/privateKey.key", "utf8"),
};

const server = app.listen(SERVICE_PORT, function () {
  const port = server.address().port;
  console.log("HTTP server started on ", port);
  serverlogger.info("HTTP server started on ", port);
});

const serverhttps = https
  .createServer(options, app)
  .listen(SERVICE_PORTHTTPS, function () {
    const port = serverhttps.address().port;
    console.log("HTTPS server started on ", port);
    serverlogger.info("HTTPS server started on ", port);
  });

const closeServer = () => {
  serverlogger.info("closing app");
};

process.on("SIGTERM", closeServer);
process.on("SIGINT", closeServer);

process.on("uncaughtException", (err) => {
  console.log(err, "uncaughtException");
  serverlogger.error(err.stack);
});

process.on("exit", (err) => {
  console.log(err, "exit");
  serverlogger.error(err.stack);
});
