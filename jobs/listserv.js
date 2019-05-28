const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1")
const nlu = new NaturalLanguageUnderstandingV1({
  version: "2019-04-02",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
  iam_apikey: process.env.IAM_API_KEY
})
const Parser = require("rss-parser")
const event = require("../lib/event")
const calendar = require("../lib/calendar")
const debug = require("debug")("dartcal:jobs:listserv")

module.exports = async () => {
  const parser = new Parser()
  const feed = await parser.parseURL(process.env.EVENT_FEED)

  debug("Checking", feed.title)

  for (const item of feed.items) {
    debug("processing item")

    try {
      // debug("item: %o", item)

      // parse disgusting, ugly, email HTML
      if (!event.clean(item)) continue

      // feed to Watson
      const result = await nlu.analyze({
        text: item.content,
        features: {
          entities: {
            model: process.env.MODEL_ID
          }
        }
      })
      // debug("entities: %o", result.entities)

      // extract key event info
      const info = event.extract(result.entities, item)
      if (!info) continue
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
  }

  debug("job finished successfully!")
}
