const KeyValue = require('../../models/key-value')

const IPFS = require('ipfs')
const PayToWriteDB = require('../../lib/orbitdb/pay-to-write')

const config = require('../../../config')

let _this

class PTWDBController {
  constructor () {
    _this = this

    // Encapsulate dependencies
    this.KeyValue = KeyValue
    this.config = config
    this.ipfs = {}
    this.ptwDb = {}

    // Returns a Promise that resolves to `true` when the database is ready.
    this.dbIsReady = this.startIpfs()
  }

  async startIpfs () {
    try {
      this.ipfs = await IPFS.create()

      const config = {
        ipfs: this.ipfs
      }
      this.ptwDb = new PayToWriteDB(config)

      this.db = await this.ptwDb.createDb(this.config.orbitDbName)

      return true
    } catch (err) {
      console.log('Error while trying to start IPFS: ', err)
      // Do not throw error.
    }
  }

  /*
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "user": { "email": "email@format.com", "password": "secretpasas" } }' localhost:5001/users
   */
  async writeToDb (ctx) {
    try {
      const key = ctx.request.body.txid

      const rndValue = Math.floor(Math.random() * 1000000)

      console.log(`Adding key: ${key}, with value: ${rndValue}`)

      const hash = await _this.db.put(key, rndValue)
      console.log('hash: ', hash)

      ctx.body = {
        success: true
      }
    } catch (err) {
      console.error(err)
      ctx.throw(422, err.message)
    }
  }

  readAll (ctx) {
    try {
      ctx.body = {
        success: true
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }
}

module.exports = PTWDBController
