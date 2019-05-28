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

  calendar.acl.insert(
    {
      calendarId: "primary",
      requestBody: {
        role: "reader",
        scope: {
          type: "default"
        }
      }
    },
    err => {
      if (err) {
        console.error(err)
        process.exit(2)
      }
      debug("made calendar public")
    }
  )
})

google.options({
  auth: jwtClient
})

exports.list = async () => {
  const result = await calendar.events.list({
    calendarId: "primary"
  })

  debug("listing events %o", result)

  return result.data
}

exports.insert = async event => {
  const result = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event
  })

  debug("adding event %o", result)

  return result.data
}

exports.update = async event => {
  const result = await calendar.events.update({
    calendarId: "primary",
    requestBody: event
  })

  debug("updating event %o", result)

  return result.data
}
