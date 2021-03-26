/*
  This is an e2e example that loads the database and attempts to write to it.
  The TXID for the key is checked against the live blockchain.
*/

// Customize these constants.
// const TXID = '7429dff697633eb43efbea5d8552cec4911b780bf5eb4bc748fca4eed2cb8faa'
const TXID = '55abb1d78519b0f6e916c68799be2402a6773ffd3dabddbff6c02337572f525f'
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

    let rndKey = Math.floor(Math.random() * 1000000)
    rndKey = rndKey.toString()
    const rndValue = Math.floor(Math.random() * 1000000)

    rndKey = TXID
    // rndValue = 123

    console.log(`Adding key: ${rndKey}, with value: ${rndValue}`)

    await db.put(rndKey, rndValue)
  } catch (err) {
    console.error('Error in startExample(): ', err)
  }
}
startExample()
