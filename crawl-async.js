const async = require('async')
const mainURL = 'https://medium.com'
const MAX_CONNECTION = 5
const { start, fetch } = require('./helper')
const queues = async.queue(fetch, MAX_CONNECTION)
start(mainURL, queues)