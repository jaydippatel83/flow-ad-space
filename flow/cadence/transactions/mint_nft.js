export const mintNFTFLow = `
import Fans from 0x50a0fed12f57c962

transaction(ipfsHash: String, name: String) {

  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&Fans.Collection>(from: /storage/FansCollection)
                        ?? panic("This collection does not exist here")

    let nft <- Fans.createToken(ipfsHash: ipfsHash, metadata: {"name": name})

    collection.deposit(token: <- nft)
  }

  execute {
    log("A user minted an NFT into their account")
  }
}
`