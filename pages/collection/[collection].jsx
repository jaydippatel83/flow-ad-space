import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { collection_item_data } from "../../data/collection_data";
import Auctions_dropdown from "../../components/dropdown/Auctions_dropdown";
import Social_dropdown from "../../components/dropdown/Social_dropdown";
import Collection_items from "../../components/collectrions/Collection_items";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Meta from "../../components/Meta";
import { CadenceContext } from "../../context/CadenceContext";
import { AuthContext } from "../../context/AuthConext";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../components/firebase";

const Collection = () => {
  const [likesImage, setLikesImage] = useState(false);
  const router = useRouter();
  const pid = router.query.collection;
  const cadenceContext = useContext(CadenceContext);
  let { getNFTs, nfts, rentNFTs } = cadenceContext;
  const authContext = useContext(AuthContext);
  let { user } = authContext;

  useEffect(() => {
    const init = async () => {
      await getNFTs();
    };
    init();
  }, [user]);


  const [nftData,setNftData]=useState([])
  
	useEffect(()=>{
		getNftData();
	},[])


	async function getNftData() {
    const arry =[];
		const q = query(collection(db, "CreateNFTs"));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((fire) => { 
			const id = fire.id;
      arry.push({ ...fire.data(), id })  
		})
    setNftData(arry);
	}

  const handleLikes = () => {
    if (!likesImage) {
      setLikesImage(true);
    } else {
      setLikesImage(false);
    }
  };
 

  return (
    <>
      <Meta title={`${pid} || FAN(Flow Ad Network)`} />
      <div className="pt-[5.5rem] lg:pt-24">
        {/* <!-- Banner --> */}
        <div className="relative h-[300px]">
          <Image
            src="/images/gradient.jpg"
            alt="banner"
            layout="fill"
            objectFit="cover"
          />
        </div>
       
      </div>

      <Collection_items />
     
    </>
  );
};

export default Collection;
