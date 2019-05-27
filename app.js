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
const createError = require("http-errors")

// hbs.registerPartials(path.join(__dirname, "views/partials"))

app
  .use(require("helmet"))
  .use(require("morgan")("dev"))
  .use(express.urlencoded({ extended: false }))
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "hbs")
  .get("/", async (req, res) => {
    // TODO:
  })
  .use((req, res, next) => {
    // catch 404 and forward it to error handler
    next(createError(404))
  })
  .use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
  })

app.listen(process.env.PORT, err => {
  if (err) console.error(err)
  else debug("Server started!")
})
