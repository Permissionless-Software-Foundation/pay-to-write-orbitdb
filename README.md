# pay-to-write-orbitdb

This is an npm JavaScript library for creating an OrbitDB key-value store database. It works in both node.js and web-browser flavors of JavaScript.

The OrbitDB created by this library contains a special access control code. Anyone is allowed to write to the database, so long as they provide the TXID for a transaction burning a specific quantity of a specific SLP token. The burning of the SLP token increases scarcity and thus price. That gives the issuer of the the token an incentive to maintain software around this database.

# Licence
[MIT](LICENSE.md)

test
