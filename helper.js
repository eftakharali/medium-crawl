const cheerio = require('cheerio')
const rp = require('request-promise')
const fs = require('fs')

const mediumLinks = {}

function pageProcessor(url, $, queues) {

    $(`a[href^="${url}"]`).each((index, a) => {
        const link = removeTrailingSlash(a.attribs.href.split('?')[0])

        if (!mediumLinks[link]) {
            mediumLinks[link] = false
            queues.push(link)
            fs.appendFile('mediumlinks.csv', link + "\n", (err)=> { if(err) console.error(err) })
        }
    })
}

function removeTrailingSlash(str) {
    if (str.substr(-1) === '/') return str.substr(0, str.length - 1)
    return str
}

function fetch (url, callback) {
  const options = {
    uri: url,
    transform: function (body) {
        return cheerio.load(body);
    }
  }
  rp.get(options).then($ => {
    pageProcessor(url, $, queues)
    mediumLinks[url] = true
  }).catch(err => {
    callback(err, url)
  })
}

function start (url, queue) {
  queues = queue
  mediumLinks[url] = false
  fs.unlink('mediumlinks.csv', () => queues.push(removeTrailingSlash(url)))
}

module.exports = {
  start: start,
  fetch : fetch
}