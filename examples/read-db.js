/*
  This is an e2e example that loads the database and attempts to write to it.
  The TXID for the key is checked against the live blockchain.
*/

// Customize these constants.
// const TXID = '2093afb8de46f30b43ce7c5fbdf4ab667768edd47937efad7e2c2f12e7fe623d'
const DB_NAME = 'testdb002'

// Public npm libraries.
const IPFS = require('ipfs')

const PayToWriteDB = require('../index')

async function startExample () {
  try {
    const ipfs = await IPFS.create()

    const config = {
      ipfs
    }
    const ptwDb = new PayToWriteDB(config)

    const db = await ptwDb.createDb(DB_NAME)

    // const data = await db.iterator({ limit: -1 }).collect()
    const data = db.all
    console.log(`data: ${JSON.stringify(data, null, 2)}`)
  } catch (err) {
    console.error('Error in startExample(): ', err)
  }
}
startExample()
