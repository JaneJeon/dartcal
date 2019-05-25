require("express-async-errors")
require("dotenv").config()

const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")

hbs.registerPartials(path.join(__dirname, "views/partials"))

app
  .use(require("helmet"))
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "hbs")
  .get("/", async (req, res) => {
    //
  })

app.listen(process.env.PORT, err => {
  if (err) console.error(err)
})
