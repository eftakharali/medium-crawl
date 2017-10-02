const {fetch, start} = require('./helper')

function createQueue(handler, errorHandler, maxConnection) {
    return {
        lists: [],
        connectionCount: 0,
        push: function (item) {
            this.lists.push(item)
            this.processURLs()
        },
        processURLs: function () {
            while (this.lists.length > 0 && this.connectionCount < maxConnection) {
                this.connectionCount++
                this.nextRequest()
            }
        },
        nextRequest: function (prevError) {
            if (prevError) errorHandler(prevError)
            if (this.lists.length === 0) return
            const item = this.lists.shift()
            handler(item, this.nextRequest.bind(this))
        }
    }
}

const queue = createQueue(fetch, (error)=> { console.error(error) }, 5)
const mainURL = 'https://medium.com'
start(mainURL, queue)
