const htmlToText = require("html-to-text")
const magic = require("chrono-node")
const debug = require("debug")("dartcal:lib:event")
const dayjs = require("dayjs")
const { base32hex } = require("rfc4648")

exports.clean = item => {
  const content = htmlToText
    .fromString(item.content.replace(/\[[^\[]+]/g, ""), {
      wordwrap: false,
      ignoreImage: true,
      singleNewLineParagraphs: true
    })
    .replace(/\n{2,}/g, "\n")
    .trim()

  if (!content) return

  const result =
    `CREATOR: ${item.creator}\n` +
    `TITLE: ${item.title}\n` +
    `CONTENT: ${content}`
  debug("cleaned result: %o", result)

  item.content = result

  return result
}

exports.extract = (entities, item) => {
  let ABS_DATE, RELTIMEOFDAY, RELDAYOFWEEK
  let DURATION, TIME
  let LOCATION

  item.isoDate = Date.parse(item.isoDate)

  entities.forEach(entity => {
    if (entity.type == "ABS_DATE" && !ABS_DATE) ABS_DATE = entity.text
    if (entity.type == "RELTIMEOFDAY" && !RELTIMEOFDAY)
      RELTIMEOFDAY = entity.text
    if (entity.type == "RELDAYOFWEEK" && !RELDAYOFWEEK)
      RELDAYOFWEEK = entity.text
    if (entity.type == "DURATION" && !DURATION) DURATION = entity.text
    if (entity.type == "TIME" && !TIME) TIME = entity.text
    if (entity.type == "LOCATION" && !LOCATION) LOCATION = entity.text
  })

  const date = ABS_DATE || RELTIMEOFDAY || RELDAYOFWEEK
  const time = DURATION || TIME

  debug("extracted location:", LOCATION)
  debug("extracted date:", date)
  debug("extracted time:", time)

  // if date is missing, then YEET this fucker out
  if (!date) return

  const results = magic.parse(`${date} at ${time}`, item.isoDate, {
    forwardDate: true
  })

  // assume the default "time" is noon
  results[0].start.imply("hour", 12)

  debug("extracted start: %o", results[0].start)
  debug("extracted end: %o", results[0].end)

  const start = dayjs(results[0].start.date())
  const end = results[0].end ? dayjs(results[0].end.date()) : start.add(1, "h")

  // https://github.com/googleapis/google-api-nodejs-client/blob/master/src/apis/calendar/v3.ts#L513
  return {
    created: new Date(item.isoDate).toISOString(),
    description: item.content,
    end: { dateTime: end.format() },
    id: base32hex.stringify(item.creator + start.format()).toLowerCase(),
    location: LOCATION,
    organizer: { displayName: item.creator },
    source: item.link,
    start: { dateTime: start.format() },
    summary: item.title
  }
}
