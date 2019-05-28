// this person is a literal GOD:
// https://github.com/youssefsharief/node.js-google-calendar-api-sample
const { google } = require("googleapis")
const calendar = google.calendar("v3")
const credentials = require("../credentials.json")
const debug = require("debug")("dartcal:lib:calendar")

const jwtClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/calendar"]
)

jwtClient.authorize(err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  debug("authenticated to google services")
})

google.options({
  auth: jwtClient
})

exports.list = async () => {
  const result = await calendar.events.list({
    calendarId: process.env.CALENDAR_ID
  })

  debug("listing events %o", result)

  return result.data
}

exports.insert = async event => {
  const result = await calendar.events.insert({
    calendarId: process.env.CALENDAR_ID,
    requestBody: event
  })

  debug("adding event %o", result)

  return result.data
}

exports.update = async event => {
  const result = await calendar.events.update({
    calendarId: process.env.CALENDAR_ID,
    requestBody: event
  })

  debug("updating event %o", result)

  return result.data
}
