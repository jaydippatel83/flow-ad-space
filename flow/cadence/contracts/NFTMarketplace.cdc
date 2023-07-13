// NOTE: I deployed this to 0x05 in the playground
import NonFungibleToken from 0x631e88ae7f1d7c20 //Document
import Fans2 from 0x03c1bff76b994e92 // First deployed this
import FungibleToken from 0x9a0766d93b6608b7 //Document
import FlowToken from  0x7e60df042a9c0868 //Document

pub contract NFTMarketplace2 {

  pub struct SaleItem {
    pub let price: UFix64
    
    pub let nftRef: &Fans2.NFT
    
    init(_price: UFix64, _nftRef: &Fans2.NFT) {
      self.price = _price
      self.nftRef = _nftRef
    }
  }

  pub resource interface SaleCollectionPublic {
    pub fun getIDs(): [UInt64]
    pub fun getPrice(id: UInt64): UFix64
    pub fun purchase(id: UInt64, recipientCollection: &Fans2.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault)
  }

  pub resource SaleCollection: SaleCollectionPublic {
    // maps the id of the NFT --> the price of that NFT
    pub var forSale: {UInt64: UFix64}
    pub let Fans2Collection: Capability<&Fans2.Collection>
    pub let FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>

    pub fun listForSale(id: UInt64, price: UFix64) {
      pre {
        price >= 0.0: "It doesn't make sense to list a token for less than 0.0"
        self.Fans2Collection.borrow()!.getIDs().contains(id): "This SaleCollection owner does not have this NFT"
      }

      self.forSale[id] = price
    }

    pub fun unlistFromSale(id: UInt64) {
      self.forSale.remove(key: id)
    }

    pub fun purchase(id: UInt64, recipientCollection: &Fans2.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault) {
      pre {
        payment.balance == self.forSale[id]: "The payment is not equal to the price of the NFT"
      }

      recipientCollection.deposit(token: <- self.Fans2Collection.borrow()!.withdraw(withdrawID: id))
      self.FlowTokenVault.borrow()!.deposit(from: <- payment)
      self.unlistFromSale(id: id)
    }

    pub fun getPrice(id: UInt64): UFix64 {
      return self.forSale[id]!
    }

    pub fun getIDs(): [UInt64] {
      return self.forSale.keys
    }

    init(_Fans2Collection: Capability<&Fans2.Collection>, _FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>) {
      self.forSale = {}
      self.Fans2Collection = _Fans2Collection
      self.FlowTokenVault = _FlowTokenVault
    }
  }

  pub fun createSaleCollection(Fans2Collection: Capability<&Fans2.Collection>, FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>): @SaleCollection {
    return <- create SaleCollection(_Fans2Collection: Fans2Collection, _FlowTokenVault: FlowTokenVault)
  }

  init() {

  }
}