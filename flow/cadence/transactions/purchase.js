export const purchaseTx = `
import Fans2 from 0x03c1bff76b994e92
import NonFungibleToken from 0x631e88ae7f1d7c20
import NFTMarketplace2 from 0x03c1bff76b994e92
import FlowToken from 0x7e60df042a9c0868

transaction(account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = getAccount(account).getCapability(/public/MySaleCollection)
                        .borrow<&NFTMarketplace2.SaleCollection{NFTMarketplace2.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

    let recipientCollection = getAccount(acct.address).getCapability(/public/Fans2Collection) 
                    .borrow<&Fans2.Collection{NonFungibleToken.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

    let price = saleCollection.getPrice(id: id)

    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault

    saleCollection.purchase(id: id, recipientCollection: recipientCollection, payment: <- payment)
  }

  execute {
    log("A user purchased an NFT")
  }
}

`