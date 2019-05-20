require("dotenv").config()
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1")
const nlu = new NaturalLanguageUnderstandingV1({
  version: "2019-04-02",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api"
})

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
    delete item.contentSnippet
    delete item.author

    const result = await nlu.analyze({
      html: item.content,
      features: {
        categories: {},
        concepts: {},
        entities: {},
        keywords: {}
      }
    })

    console.log(result)
    console.log(item)
  }
}

hello().catch(console.error)
