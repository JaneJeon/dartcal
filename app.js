require("express-async-errors")
require("dotenv").config()

// schedule jobs
const cron = require("node-cron")
cron.schedule("* * */6 * * *", require("./jobs/listserv")) // every 6 hours

const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
const debug = require("debug")("dartcal:app")

// hbs.registerPartials(path.join(__dirname, "views/partials"))

app
  .use(require("helmet"))
  // .use(express.static(path.join(__dirname, "public")))
  // .set("views", path.join(__dirname, "views"))
  // .set("view engine", "hbs")
  .get("/", async (req, res) => {
    //
  })

app.listen(process.env.PORT, err => {
  if (err) console.error(err)
  else debug("Server started!")
})
