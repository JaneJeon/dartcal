require("dotenv").config()

// schedule jobs
const cron = require("node-cron")
const schedule =
  process.env.NODE_ENV !== "production" ? "* * * * *" : "* */6 * * *" // 1 min vs. 6 hours

cron.schedule(schedule, require("./jobs/listserv"))
