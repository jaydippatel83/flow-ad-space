import React, { useState, useEffect, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Image from "next/image";
import Auctions_dropdown from "../../components/dropdown/Auctions_dropdown";
import Link from "next/link";
import Trending_categories_items from "../categories/trending_categories_items";
import { CadenceContext } from "../../context/CadenceContext";
import { AuthContext } from "../../context/AuthConext";

const User_items = () => {
  const [itemActive, setItemActive] = useState(1);
  const cadenceContext = useContext(CadenceContext);
  let { getMyNFTS, myNFTs } = cadenceContext;
  const authContext = useContext(AuthContext);
  let { user } = authContext;
  const tabItem = [
    {
      id: 1,
      text: "on sale",
      icon: "on-sale",
    },
    {
      id: 2,
      text: "owned",
      icon: "owned",
    },
    {
      id: 3,
      text: "created(20)",
      icon: "created",
    },
  ];

  useEffect(() => {
    const init = async () => {
      await getMyNFTS();
    };
    init();
  }, [user]);

  return (
    <>
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          {/* <img src="img/gradient_light.jpg" alt="gradient" className="h-full w-full" /> */}
          <Image
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
            layout="fill"
          />
        </picture>
        <div className="container">
          {/* <!-- Tabs Nav --> */}
          <Tabs className="tabs">
            <TabList className="nav nav-tabs scrollbar-custom mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
              {tabItem.map(({ id, text, icon }) => {
                return (
                  <Tab
                    className="nav-item"
                    role="presentation"
                    key={id}
                    onClick={() => setItemActive(id)}
                  >
                    <button
                      className={
                        itemActive === id
                          ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                          : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                      }
                    >
                      <svg className="icon mr-1 h-5 w-5 fill-current">
                        <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                      </svg>
                      <span className="font-display text-base font-medium">
                        {text}
                      </span>
                    </button>
                  </Tab>
                );
              })}
            </TabList>

            <TabPanel>
              <div>
                {/* <!-- Filter --> */}
                <Trending_categories_items />
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                {/* <!-- Filter --> */}
                <Trending_categories_items />
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                {/* <!-- Filter --> */}
                <Trending_categories_items />
              </div>
            </TabPanel>
          </Tabs>
        </div>
        <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
          {myNFTs.map((nft) => {
            return (
              <article key={nft.id}>
                <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
                  <div className="mb-4 flex items-center justify-between relative">
                    {/* auction dropdown */}
                    <Auctions_dropdown classes="dark:hover:bg-jacarta-600 dropdown hover:bg-jacarta-100 rounded-full " />
                  </div>
                  <figure className="relative">
                    <Link href={/item/ + ""}>
                      <a>
                        <img
                          src={nft.image.replace(
                            "ipfs://",
                            "https://nftstorage.link/ipfs/"
                          )}
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
                    <Link href={/item/ + ""}>
                      <a>
                        <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                          {nft.name}
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
                    <span className="dark:text-jacarta-300">Rent Amount</span>
                    &nbsp;&nbsp;
                    <span className="dark:text-jacarta-100 text-jacarta-700">
                      {nft.Price}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default User_items;
