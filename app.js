require("express-async-errors")
require("dotenv").config()

const express = require("express")
const app = express()

app
  .use(require("helmet"))
  .use(require("cors"))
  .get("/")

app.listen(process.env.PORT, err => {
  if (err) console.error(err)
})
