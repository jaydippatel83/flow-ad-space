export const setupUserTx = `
import Fans from 0x50a0fed12f57c962
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace from 0x50a0fed12f57c962

transaction {

  prepare(acct: AuthAccount) {
    let FansCollectionRef = acct.borrow<&Fans.Collection>(from: /storage/FansCollection)

    if (FansCollectionRef == nil) {
      acct.save(<- Fans.createEmptyCollection(), to: /storage/FansCollection)
    }
    acct.link<&Fans.Collection{Fans.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/FansCollection, target: /storage/FansCollection)
    acct.link<&Fans.Collection>(/private/FansCollection, target: /storage/FansCollection)
    
    let mySaleCollectionRef = acct.borrow<&NFTMarketplace.SaleCollection>(from: /storage/MySaleCollection)

    if (mySaleCollectionRef == nil) {

    let FansCollection = acct.getCapability<&Fans.Collection>(/private/FansCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.save(<- NFTMarketplace.createSaleCollection(FansCollection: FansCollection, FlowTokenVault: FlowTokenVault), to: /storage/MySaleCollection)
    acct.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/MySaleCollection, target: /storage/MySaleCollection)
  }
}

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`