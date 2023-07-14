import React, { createContext, useEffect, useState, useContext } from "react";
import { db } from "../components/firebase";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { mintNFTFLow } from "../flow/cadence/transactions/mint_nft";
import { setupUserTx } from "../flow/cadence/transactions/setup_user";
import { listForSaleTx } from "../flow/cadence/transactions/list_for_sale";
import { getSaleNFTsScript } from "../flow/cadence/scripts/get_sale_nfts";
import { getNFTsScript } from "../flow/cadence/scripts/get_nfts";
import { purchaseTx } from "../flow/cadence/transactions/purchase";
import { AuthContext } from "./AuthConext";
import axios from "axios";

export const CadenceContext = createContext(undefined);

export const CadenceContextProvider = (props) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  const [nfts, setNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);

  const setupUser = async () => {
    const transactionId = await fcl
      .send([
        fcl.transaction(setupUserTx),
        fcl.args([]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionId, "transactionId");

    return fcl.tx(transactionId).onceSealed();
  };

  const createNFT = async (_price, _metadataurl, _name) => {
    var nftId;
    const ipfsHash = _metadataurl;
    const name = _name;
    try {
      const transactionId = await fcl
        .send([
          fcl.transaction(mintNFTFLow),
          fcl.args([fcl.arg(ipfsHash, t.String), fcl.arg(name, t.String)]),
          fcl.payer(fcl.authz),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999),
        ])
        .then(fcl.decode);
      const transactionStatusMinting = await fcl.tx(transactionId).onceSealed();

      if (transactionStatusMinting.status === 4) {
        let id = transactionStatusMinting.events[0].data.id;
        const transactionListId = await fcl
          .send([
            fcl.transaction(listForSaleTx),
            fcl.args([fcl.arg(id, t.UInt64), fcl.arg(_price, t.UFix64)]),
            fcl.payer(fcl.authz),
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.limit(9999),
          ])
          .then(fcl.decode);
        const transactionStatusSale = await fcl
          .tx(transactionListId)
          .onceSealed();

        console.log(transactionStatusSale, "transactionStatusSale");
        nftId = id;
      } else {
        console.log(
          "Transaction failed:",
          transactionStatusMinting.errorMessage
        );
      }
      return nftId;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const getNFTs = async () => {
    let account = user?.addr;
    try {
      if (account) {
        const result = await fcl
          .send([
            fcl.script(getSaleNFTsScript),
            fcl.args([fcl.arg(account, t.Address)]),
          ])
          .then(fcl.decode);

        var nfts = await Promise.all(
          Object.keys(result).map(async (key) => {
            let ipfs = await axios.get(result[key].nftRef.ipfsHash);
            ipfs.data.id = result[key].nftRef.id;
            return ipfs.data;
          })
        );
        setNfts(nfts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMyNFTS = async () => {
    let account = user?.addr;
    if (account) {
      try {
        const result = await fcl
          .send([
            fcl.script(getNFTsScript),
            fcl.args([fcl.arg(account, t.Address)]),
          ])
          .then(fcl.decode);

        var nfts = await Promise.all(
          Object.keys(result).map(async (key) => {
            let ipfs = await axios.get(result[key].ipfsHash);
            ipfs.data.id = result[key].id;
            return ipfs.data;
          })
        );
        setMyNFTs(nfts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const rentNFTs = async (id) => {
    let address = user?.addr;
    let Id = parseInt(id);
    console.log(id, "iddd");
    const transactionId = await fcl
      .send([
        fcl.transaction(purchaseTx),
        fcl.args([fcl.arg(address, t.Address), fcl.arg(Id, t.UInt64)]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionId);
    return fcl.tx(transactionId).onceSealed();
  };

  return (
    <CadenceContext.Provider
      value={{
        createNFT,
        setupUser,
        getNFTs,
        nfts,
        rentNFTs,
        getMyNFTS,
        myNFTs,
      }}
      {...props}
    >
      {props.children}
    </CadenceContext.Provider>
  );
};
