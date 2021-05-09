const KeyValue = require('../../models/key-value')

const IPFS = require('ipfs')
const PayToWriteDB = require('../../lib/orbitdb-lib/pay-to-write')

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

      // TODO Include signature
      // const sig = ctx.request.body.signature

      // Check to see if the TXID already exists in the MongoDB.
      const mongoRes = await _this.KeyValue.find({ key })
      if (mongoRes.length > 0) {
        // console.log(`mongoRes: `, mongoRes)
        const mongoKey = mongoRes[0].key

        if (mongoKey === key) {
          // Entry is already in the database.
          throw new Error('Entry already in database')
        }
      }

      const rndValue = Math.floor(Math.random() * 1000000)

      console.log(`Adding key: ${key}, with value: ${rndValue}`)

      // Add the entry to the Oribit DB
      const hash = await _this.db.put(key, rndValue)
      console.log('hash: ', hash)

      // Add the entry to the MongoDB if it passed the OrbitDB checks.
      const kvObj = {
        hash,
        key,
        value: rndValue
      }
      const keyValue = new _this.KeyValue(kvObj)
      await keyValue.save()

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
      const allData = _this.db.all

      ctx.body = {
        success: true,
        data: allData
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }
}

module.exports = PTWDBController
