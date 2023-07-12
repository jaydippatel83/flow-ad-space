export const getNFTsScript = `
import Fans from 0x50a0fed12f57c962
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&Fans.NFT] {
  let collection = getAccount(account).getCapability(/public/FansCollection)
                    .borrow<&Fans.Collection{NonFungibleToken.CollectionPublic, Fans.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&Fans.NFT] = []

  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowEntireNFT(id: id))
  }

  return returnVals
}
`