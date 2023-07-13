export const mintNFTFLow = `
import Fans2 from 0x03c1bff76b994e92

transaction(ipfsHash: String, name: String) {

  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&Fans2.Collection>(from: /storage/Fans2Collection)
                        ?? panic("This collection does not exist here")

    let nft <- Fans2.createToken(ipfsHash: ipfsHash, metadata: {"name": name})

    collection.deposit(token: <- nft)
  }

  execute {
    log("A user minted an NFT into their account")
  }
}
`