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

  writeToDb (ctx) {
    ctx.body = {
      success: true
    }
  }

  readAll (ctx) {
    ctx.body = {
      success: true
    }
  }
}

module.exports = PTWDBController
