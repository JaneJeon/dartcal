const Parser = require("rss-parser")
const event = require("../lib/event")
const calendar = require("../lib/calendar")
const debug = require("debug")("dartcal:jobs:listserv")

module.exports = async () => {
  const parser = new Parser()
  const feed = await parser.parseURL(process.env.EVENT_FEED)

  debug("Checking", feed.title)

  const promises = feed.items.map(async item => {
    debug("processing item", item.guid)

    try {
      // parse disgusting, ugly, email HTML
      event.clean(item)

      // extract key event info
      const info = event.extract(item)
      // debug("extracted info: %o", info)

      // insert events
      try {
        await calendar.insert(info)
      } catch (err) {
        console.error(err)

        // it is possible that calendar insert failed because there already was an event.
        // in that case, update the event
        try {
          await calendar.update(info)
        } catch (err2) {
          console.error(err2)

          return err2
        }
      }
    } catch (err) {
      console.error(err)
    }
  })

  await Promise.all(promises)

  debug("job finished successfully!")
}
