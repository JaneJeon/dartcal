const htmlToText = require("html-to-text")

exports.clean = item => {
  const content = htmlToText
    .fromString(item.content.replace(/\[[^\[]+]/g, ""), {
      wordwrap: false,
      ignoreImage: true,
      singleNewLineParagraphs: true
    })
    .replace(/\n{2,}/g, "\n")
    .trim()

  return (
    `CREATOR: ${item.creator}\n` +
    `TITLE: ${item.title}\n` +
    `DATE: ${item.isoDate}\n` +
    `CONTENT: ${content}\n`
  )
}
