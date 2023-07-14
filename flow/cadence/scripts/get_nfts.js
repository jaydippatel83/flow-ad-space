export const getNFTsScript = `
import Fans2 from 0x03c1bff76b994e92
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&Fans2.NFT] {
  let collection = getAccount(account).getCapability(/public/Fans2Collection)
                    .borrow<&Fans2.Collection{NonFungibleToken.CollectionPublic, Fans2.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&Fans2.NFT] = []

  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowEntireNFT(id: id))
  }

  return returnVals
}
`