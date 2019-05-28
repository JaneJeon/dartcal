const htmlToText = require("html-to-text")
const magic = require("chrono-node")
const debug = require("debug")("dartcal:lib:event")
const dayjs = require("dayjs")
const { base32hex } = require("rfc4648")

exports.clean = item => {
  item.content = htmlToText
    .fromString(item.content.replace(/\[[^\[]+]/g, ""), {
      wordwrap: false,
      ignoreImage: true,
      singleNewLineParagraphs: true
    })
    .replace(/\n{2,}/g, "\n")
    .trim()

  if (!item.content) throw new Error("No content found!")

  // debug("cleaned content", item.content)
}

exports.extract = item => {
  const results = magic.parse(item.content, Date.parse(item.isoDate), {
    forwardDate: true
  })

  if (!results[0] || !results[0].start)
    throw new Error("Could not parse start date!")

  // assume the default "time" is noon
  results[0].start.imply("hour", 12)

  const start = dayjs(results[0].start.date())
  const end = results[0].end ? dayjs(results[0].end.date()) : start.add(1, "h")

  debug("extracted start: %o", results[0].start)
  debug("extracted end: %o", results[0].end)
  // debug("CREATOR:", item.creator)

  // https://github.com/googleapis/google-api-nodejs-client/blob/master/src/apis/calendar/v3.ts#L513
  return {
    created: dayjs(item.isoDate).toISOString(),
    description: item.content,
    end: { dateTime: end.format() },
    id: base32hex
      .stringify(item.creator + start.format("YYYYMMDDHH"))
      .toLowerCase()
      .replace(/=/g, ""),
    organizer: { displayName: item.creator },
    source: item.link,
    start: { dateTime: start.format() },
    summary: item.title
  }
}
