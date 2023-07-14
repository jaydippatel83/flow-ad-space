import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Social_dropdown from "../../components/dropdown/Social_dropdown";
import Auctions_dropdown from "../../components/dropdown/Auctions_dropdown";
import user_data from "../../data/user_data";
import User_items from "../../components/user/User_items";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { CopyToClipboard } from "react-copy-to-clipboard";
import Head from "next/head";
import Meta from "../../components/Meta";
import { AuthContext } from "../../context/AuthConext";
import moment from "moment";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../components/firebase";

const User = () => {
  const authContext = useContext(AuthContext);
  const { user, update, setUpdate } = authContext;
  const router = useRouter();
  const pid = router.query.user;

  const [likesImage, setLikesImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState();



  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  useEffect(() => {
    pid && getUser();
  }, [pid])


  const getUser = async () => {
    if (pid === 'profile') {
      const q = query(collection(db, "Users"), where("Address", "==", user?.addr));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((fire)=>{
        const data = fire.data();
        setUserData(data);
      }) 
    } else {
      const docRef = doc(db, "Users", pid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        const data = docSnap.data();
        setUserData(data);
        console.log(data, "data");
      }
    }

  }



  return (
    <>
      <Meta title="User || FAN(Flow Ad Network)" />
      <div className="pt-[5.5rem] lg:pt-24" >
        {/* <!-- Banner --> */}
        <div className="relative h-[18.75rem]">
      
        </div>
        {/* <!-- end banner --> */}
        <section className="dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28">
          {/* <!-- Avatar --> */}
          <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <figure className="relative h-40 w-40 dark:border-jacarta-600 rounded-xl border-[5px] border-white">
              <Image
                src={userData ? userData.Photo : ""}
                alt={userData ? userData.UserName : ''}
                layout="fill"
                objectFit="contain"
                className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
              />
              <div
                className="dark:border-jacarta-600 bg-green absolute -right-3 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                data-tippy-content="Verified Collection"
              >
                {/* {icon && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="h-[.875rem] w-[.875rem] fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      )} */}
              </div>
            </figure>
          </div>

          <div className="container">
            <div className="text-center">
              <h2 className="font-display text-jacarta-700 mb-2 text-4xl font-medium dark:text-white">
                {userData ? userData.UserName : ""}
              </h2>
              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex items-center justify-center rounded-full border bg-white py-1.5 px-4">
                <img
                  src="/images/chains/fl.png"
                  alt="avatar"
                  className="rounded-2lg mr-1 h-4 w-4"
                  loading="lazy"
                />

                <Tippy
                  hideOnClick={false}
                  content={
                    copied ? <span>copied</span> : <span>copy</span>
                  }
                >
                  <button className="js-copy-clipboard dark:text-jacarta-200 max-w-[10rem] select-none overflow-hidden text-ellipsis whitespace-nowrap">
                    <CopyToClipboard
                      text={userData ? userData.Address : ''}
                      onCopy={() => setCopied(true)}
                    >
                      <span>{userData ? userData.Address : ''}</span>
                    </CopyToClipboard>
                  </button>
                </Tippy>
              </div>

              <p className="dark:text-jacarta-300 mx-auto mb-2 max-w-xl text-lg">
                {userData ? userData.Bio : ''}
              </p>
              <span className="text-jacarta-400">
                Joined {userData ? moment.unix(userData.CreatedAt.seconds).format('LL') : ''}
              </span>
            </div>
          </div>
        </section>
        {/* <!-- end profile --> */}
        <User_items />
      </div>
    </>
  );
};

export default User;
