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

      {/* <Collection_items /> */}
      <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4 mb-52 mt-14">
        { nftData && nftData.map((nft) => {  
          return (
            <article key={nft.id}>
              <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between relative">
                  {/* auction dropdown */}
                  {/* <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropdown hover:bg-jacarta-100 rounded-full " /> */}
                </div>
                <figure className="relative">
                  <Link href={/item/ + nft.id}>
                    <a>
                      <img
                        src={nft.Photo}
                        alt="item 8"
                        className="w-full rounded-[0.625rem]"
                        loading="lazy"
                        height="100%"
                        width="100%"
                        layout="responsive"
                        objectFit="cover"
                      />
                    </a>
                  </Link>
                  {/* <Countdown_timer time={+auction_timer} /> */}
                </figure>
                <div className="mt-7 flex items-center justify-between">
                  <Link href={/item/ + nft.id}>
                    <a>
                      <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                        {nft.Nftname}
                      </span>
                    </a>
                  </Link>
                 
                </div>
                <div className="mt-2 text-sm flex items-center justify-between">
                  <span className="dark:text-jacarta-300">Rent Amount</span>
                  &nbsp;&nbsp;
                  <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                    <span>
                      <img
                        src="/images/chains/fl.png"
                        alt="avatar"
                        className="rounded-2lg mr-1 h-4 w-4"
                        loading="lazy"
                      />
                    </span>
                    <span className="dark:text-jacarta-100 text-jacarta-700">
                    {nft.Price}
                  </span>
                  </span>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={async () => await rentNFTs(nft.nftId)}
                  >
                    Rent Item
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default Collection;
