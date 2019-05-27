require("express-async-errors")
require("dotenv").config()

// schedule jobs
const cron = require("node-cron")
const schedule =
  process.env.NODE_ENV !== "production" ? "* * * * *" : "* */6 * * *" // 1 min vs. 6 hours
cron.schedule(schedule, require("./jobs/listserv"))

const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
const calendar = require("./lib/calendar")
const debug = require("debug")("dartcal:app")
const createError = require("http-errors")

hbs.registerPartials(path.join(__dirname, "views/partials"))

app
  .use(require("helmet")())
  .use(require("morgan")("dev"))
  .use(express.urlencoded({ extended: false }))
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "hbs")
  .get("/", async (req, res) => {
    // TODO:
  })
  .get("/events", async (req, res) => {
    debug(await calendar.list())
    res.end()
  })
  .use((req, res, next) => {
    // catch 404 and forward it to error handler
    next(createError(404))
  })
  .use((err, req, res, next) => {
    console.error(err)

    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    // res.render("error")
    res.end()
  })

app.listen(process.env.PORT || 3000, err => {
  if (err) console.error(err)
  else debug("Server started!")
})
