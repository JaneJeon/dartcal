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

  const eventPromises = feed.items.map(async item => {
    debug("item: %o", item)

    // parse disgusting, ugly, email HTML
    if (!event.clean(item)) return

    // feed to Watson
    const result = await nlu.analyze({
      text: item.content,
      features: {
        entities: {
          model: process.env.MODEL_ID
        }
      }
    })
    debug("entities: %o", result.entities)

    // extract key event info
    const info = event.extract(result.entities, item)
    debug("extracted info: %o", info)

    return info
  })

  const events = await Promise.all(eventPromises)
  debug("event infos: %o", events)

  // insert events, or if they fail, try to update them
  const gcalPromises = events.map(async evt => {
    // we don't want a single failure to bring the entire promise.all down.
    // so use this ugly AF hack: https://stackoverflow.com/a/46024590
    try {
      return calendar.insert(evt)
    } catch (err) {
      console.error(err)

      // it is possible that calendar insert failed because there already was an event.
      // in that case, update the event
      try {
        return calendar.update(evt)
      } catch (err2) {
        console.error(err2)

        return err2
      }
    }
  })

  await Promise.all(gcalPromises)
}
