require("dotenv").config()
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1")
const nlu = new NaturalLanguageUnderstandingV1({
  version: "2019-04-02",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api",
  iam_apikey: process.env.IAM_API_KEY
})
const event = require("./lib/event")

const Parser = require("rss-parser")

const hello = async () => {
  const parser = new Parser()
  const feed = await parser.parseURL(process.env.EVENT_FEED)
  console.log(feed.title)

  /* Exceptions to note:
   * - emails with "empty" content; e.g. "[cid:fe9c1a86-21da-415f-a5a5-f821f29bce9d] "
   * - replies w/o context; e.g. "*clarification because the date was only in the subject line* The show is on
   *  Monday :-) see you there"
   */
  let i = 0
  for (let i = 0; i < 3; i++) {
    const item = feed.items[i]

    const result = await nlu.analyze({
      text: event.clean(item),
      features: {
        entities: {
          model: process.env.MODEL_ID
        }
      }
    })

    console.log(JSON.stringify(result, null, 2))
  }
}

hello().catch(console.error)
