require("dotenv").config()

const Parser = require("rss-parser")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const debug = require("debug")("dartcal:train")
const event = require("./lib/event")

const hello = async () => {
  const parser = new Parser()
  const feed = await parser.parseURL(process.env.EVENT_FEED)

  feed.items.forEach(item => {
    const cleaned = event.clean(item)

    if (!cleaned) return
    debug(cleaned)

    fs.writeFileSync(
      path.join(
        "./documents",
        crypto
          .createHash("md5")
          .update(item.guid)
          .digest("hex") + ".txt"
      ),
      cleaned
    )
  })
}

hello().catch(console.error)
