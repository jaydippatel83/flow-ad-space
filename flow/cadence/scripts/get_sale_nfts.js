export const getSaleNFTsScript = `
import Fans2 from 0x03c1bff76b994e92
import NonFungibleToken from 0x631e88ae7f1d7c20
import NFTMarketplace2 from 0x03c1bff76b994e92

pub fun main(account: Address): {UInt64: NFTMarketplace2.SaleItem} {
  let saleCollection = getAccount(account).getCapability(/public/MySaleCollection)
                        .borrow<&NFTMarketplace2.SaleCollection{NFTMarketplace2.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(/public/Fans2Collection) 
                    .borrow<&Fans2.Collection{NonFungibleToken.CollectionPublic, Fans2.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UInt64: NFTMarketplace2.SaleItem} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)

    returnVals.insert(key: nftRef.id, NFTMarketplace2.SaleItem(_price: price, _nftRef: nftRef))
  }

  return returnVals
}
`