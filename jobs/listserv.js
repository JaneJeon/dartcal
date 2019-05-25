const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1")
const nlu = new NaturalLanguageUnderstandingV1({
  version: "2019-04-02",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
  iam_apikey: process.env.IAM_API_KEY
})
const Parser = require("rss-parser")
const event = require("../lib/event")
const debug = require("debug")("dartcal:jobs:listserv")

module.exports = async () => {
  const parser = new Parser()
  const feed = await parser.parseURL(process.env.EVENT_FEED)

  debug("Checking", feed.title)

  const eventPromises = feed.items.map(async item => {
    debug("item: %o", item)

    const cleaned = event.clean(item)
    if (!cleaned) return

    const result = await nlu.analyze({
      text: event.clean(item),
      features: {
        entities: {
          model: process.env.MODEL_ID
        }
      }
    })
    debug("entities: %o", result.entities)

    const info = event.extract(result.entities, item)
    debug("extracted info: %o", info)

    return info
  })

  // TODO: do something with this info
  const infos = await Promise.all(eventPromises)
  debug("event infos: %o", infos)
}
