import React, { useEffect, useState, useContext } from "react";
import HeadLine from "../headLine";
import Auctions_category_data from "../../data/auctions_category_data";
import Tippy from "@tippyjs/react";
import Countdown_timer from "../Countdown_timer";
import Auctions_dropdown from "../dropdown/Auctions_dropdown";
import Link from "next/link";
import { bidsModalShow } from "../../redux/counterSlice";
import { useDispatch } from "react-redux";
import "tippy.js/themes/light.css";
import Image from "next/image";
import auctions_category_data from "../../data/auctions_category_data";
import Likes from "../likes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; 
import { CadenceContext } from "../../context/CadenceContext";


const Auctions_categories = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loadMoreBtn, setLoadMoreBtn] = useState(true);

  const cadenceContext = useContext(CadenceContext);
  const { rentNFTs, rentLoading } = cadenceContext;

  const handleloadMore = () => {

  };

  const getExploreData = async () => {
    const arry = [];
    const q = query(collection(db, "CreateNFTs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(fire) => {
      const id = fire.id; 
      arry.push({ ...fire.data(), id });
    })
    setData(arry);
  }

  useEffect(() => {
    getExploreData();
  }, [])

  return (
    <div>
      <section className="py-24 relative">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          {/* <HeadLine
            image="https://cdn.jsdelivr.net/npm/emoji-datasource-apple@7.0.2/img/apple/64/2764-fe0f.png"
            text="Live on Rent"
            classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white"
          /> */}
          <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
            {data && data.map((item) => {
              console.log(item, "item");
              const {
                id,
                Creator,
                Description,
                EndDate,
                StartDate,
                Nftname,
                Photo,
                Price,
                nftId
              } = item;
              return (
                <article key={id}>
                  <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                    <div className="mb-4 flex items-center justify-between relative">

                      <div className="flex flex-space-x-2 ">
                        <Tippy
                          theme="tomato"
                          content={
                            <span className="py-1 px-2 block">
                              Creator
                            </span>
                          }
                        >
                          <Link href={/user/ + id}>
                            <a>
                              <img
                                src={Photo}
                                alt="creator"
                                className="h-6 w-6 rounded-full"
                                height={24}
                                width={24}
                              />
                            </a>
                          </Link>
                        </Tippy>
                        <Tippy
                          content={
                            <span className="py-1 px-2 block">
                              Owner:
                            </span>
                          }
                        >
                        </Tippy>
                      </div>
                      {/* auction dropdown */}
                      <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropdown hover:bg-jacarta-100 rounded-full " />
                    </div>
                    <figure className="relative">
                      <Link href={/item/ + id}>
                        <a>
                          <img
                            src={Photo}
                            alt="item 8"
                            className="w-full rounded-[0.625rem]"
                            loading="lazy"
                            height="100%"
                            width="100%"
                          />
                        </a>
                      </Link>
                      <Countdown_timer time={+StartDate.seconds} />
                    </figure>
                    <div className="mt-7 flex items-center justify-between">
                      <Link href={/item/ + id}>
                        <a>
                          <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                            {Nftname}
                          </span>
                        </a>
                      </Link>
                      <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                        <span>
                          <img
                            src="/images/chains/fl.png"
                            alt="avatar"
                            className="rounded-2lg mr-1 h-4 w-4"
                            loading="lazy"
                          />
                        </span>
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="dark:text-jacarta-300">Rent&nbsp;</span>
                      <span className="dark:text-jacarta-100 text-jacarta-700">
                        {Price}
                      </span>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <button
                        className="text-accent font-display text-sm font-semibold"
                        onClick={() => rentNFTs(nftId)}
                      
                      >
                    Rent
                      </button>

                      <Likes
                        like={21}
                        classes="flex items-center space-x-1"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {loadMoreBtn && (
            <div className="mt-10 text-center">
              <button
                onClick={handleloadMore}
                className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Auctions_categories;
