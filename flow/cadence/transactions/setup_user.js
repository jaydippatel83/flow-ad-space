export const setupUserTx = `
import Fans2 from 0x03c1bff76b994e92
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace2 from 0x03c1bff76b994e92

transaction {

  prepare(acct: AuthAccount) {
    let FansCollectionRef = acct.borrow<&Fans2.Collection>(from: /storage/Fans2Collection)

    if (FansCollectionRef == nil) {
      acct.save(<- Fans2.createEmptyCollection(), to: /storage/Fans2Collection)
    }
    acct.link<&Fans2.Collection{Fans2.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/Fans2Collection, target: /storage/Fans2Collection)
    acct.link<&Fans2.Collection>(/private/Fans2Collection, target: /storage/Fans2Collection)
    
    let mySaleCollectionRef = acct.borrow<&NFTMarketplace2.SaleCollection>(from: /storage/MySaleCollection)

    if (mySaleCollectionRef == nil) {

    let Fans2Collection = acct.getCapability<&Fans2.Collection>(/private/Fans2Collection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.save(<- NFTMarketplace2.createSaleCollection(Fans2Collection: Fans2Collection, FlowTokenVault: FlowTokenVault), to: /storage/MySaleCollection)
    acct.link<&NFTMarketplace2.SaleCollection{NFTMarketplace2.SaleCollectionPublic}>(/public/MySaleCollection, target: /storage/MySaleCollection)
  }
}

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`