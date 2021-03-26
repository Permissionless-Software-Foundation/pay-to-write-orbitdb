/*
  This is an e2e example that loads the database and attempts to read from it.
  The database is loaded from disk.
*/

// Customize these constants.
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
