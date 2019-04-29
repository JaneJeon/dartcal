require("dotenv").config()

const Parser = require("rss-parser")
const htmlToText = require("html-to-text")

const hello = async () => {
  const parser = new Parser()
  const feed = await parser.parseURL(process.env.EVENT_FEED)
  console.log(feed.title)

  /* Exceptions to note:
   * - emails with "empty" content; e.g. "[cid:fe9c1a86-21da-415f-a5a5-f821f29bce9d] "
   * - replies w/o context; e.g. "*clarification because the date was only in the subject line* The show is on
   *  Monday :-) see you there"
   */
  feed.items.forEach(item => {
    delete item.contentSnippet
    delete item.author
    console.log(JSON.stringify(item, null, 2))
    console.log(
      htmlToText
        .fromString(item.content.replace(/\[[^\[]+]/g, ""), {
          wordwrap: false,
          ignoreImage: true,
          singleNewLineParagraphs: true
        })
        .replace(/\n{2,}/g, "\n")
    )
    console.log("---------------------------------------------------")
    // creator, title, link, isoDate, guid
  })
}

hello().catch(console.error)
