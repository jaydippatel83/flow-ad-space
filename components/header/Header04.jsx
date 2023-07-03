import Image from "next/image";
import Link from "next/link";
import Logo from "./../../public/images/logo.png";
import WhiteLogo from "./../../public/images/logo_white.png";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import {
  isParentPageActive,
} from "../../utils/daynamicNavigation";
import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import UserProfile from "./UserProfile";

export default function Header04() {
  const [toggle, setToggle] = useState(false);
  const [isScroll, setScroll] = useState(false);
  const [user, setUser] = useState();


  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, [])

  const login = () => {
    fcl.authenticate();
  }

  const logout = () => {

  }

  // sticky menu
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 4) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }, []);

  // window resize
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        setToggle(false);
      }
    });
  });

  const route = useRouter();


  const pages = [
    {
      name: "Home",
      path: '/',
      pages: [
        {
          id: uuidv4(),
          name: "Home",
          path: "/",
        },
      ]
    },
    {
      name: "Explore",
      path: '/collection/collection_wide',
      pages: [
        {
          id: uuidv4(),
          name: "Explore",
          path: "/collection/collection_wide",
        },
      ]
    },
    {
      name: "MintNFT",
      path: '/create',
      pages: [
        {
          id: uuidv4(),
          name: "MintNFT",
          path: "/create",
        },
      ]
    },
  ]

  return (
    <>
      <header
        className={`js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors ${isScroll ? "js-page-header--is-sticky" : ""
          }`}
      >
        <div className="flex items-center px-6 py-6 xl:px-24 ">
          <Link className="shrink-0" href="/">
            <a>
              <div className="dark:hidden">
                <Image
                  src={Logo}
                  height={28}
                  width={130}
                  alt="Flow Ad Space"
                  className="max-h-7 h-auto "
                />
              </div>
              <div className="hidden dark:block">
                <Image
                  src={WhiteLogo}
                  height={28}
                  width={130}
                  alt="Flow Ad Space"
                />
              </div>
            </a>
          </Link>

          <div className="js-mobile-menu dark:bg-jacarta-800 invisible fixed inset-0 z-10 ml-auto items-center bg-white opacity-0 lg:visible lg:relative lg:inset-auto lg:flex lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent w-full">
            <nav className="navbar w-full mt-24  lg:mt-0">
              <ul className="flex flex-col justify-center lg:flex-row">
                {
                  pages.map((page, i) => (
                    <li key={i} className="js-nav-dropdown group relative">
                      <button className=" text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5 w-full">
                        <Link className="shrink-0" href={page.path}>
                          <span
                            className={
                              isParentPageActive(page.pages, route.asPath)
                                ? "text-accent  dark:text-accent"
                                : ""
                            }
                          >
                            {page.name}
                          </span>
                        </Link>
                      </button>
                    </li>
                  ))
                }

              </ul>
            </nav>
          </div>
          <div className="hidden  justify-end lg:flex">

            {
              user && user.addr ? <UserProfile user={user} />
                : <button onClick={login} className="rounded-full bg-white py-3 px-8 text-center font-semibold text-accent shadow-white-volume transition-all hover:bg-accent-dark hover:text-white hover:shadow-accent-volume">
                  SignIn
                </button>

            }
          </div>
          <div className="ml-auto flex justify-center lg:hidden">
            <button
              className="js-mobile-toggle border-jacarta-100 hover:bg-accent dark:hover:bg-accent focus:bg-accent group ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
              aria-label="open mobile menu"
              onClick={() => setToggle(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M18 18v2H6v-2h12zm3-7v2H3v-2h18zm-3-7v2H6V4h12z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className={`lg:hidden js-mobile-menu dark:bg-jacarta-800 invisible fixed inset-0 z-20 ml-auto items-center bg-white opacity-0 lg:visible lg:relative lg:inset-auto lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent ${toggle ? "nav-menu--is-open" : "hidden"
        }`}
      >
        <div className="t-0 dark:bg-jacarta-800 fixed left-0 z-10 flex w-full items-center justify-between bg-white p-6 lg:hidden">
          <div className="dark:hidden">
            <Image
              src={Logo}
              height={28}
              width={130}
              alt="Xhibiter | NFT Marketplace"
              className="max-h-7 h-auto "
            />
          </div>

          <div className="hidden dark:block">
            <Image
              src={WhiteLogo}
              height={28}
              width={130}
              alt="Xhibiter | NFT Marketplace"
            />
          </div>

          <button
            className="js-mobile-close border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent ml-2 flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]"
            onClick={() => setToggle(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              className="fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
            </svg>
          </button>
        </div>
        <form action="search" className="relative mt-24 mb-8 w-full lg:hidden">
          <input
            type="search"
            className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-3 px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
            placeholder="Search"
          />
          <span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              className="fill-jacarta-500 h-4 w-4 dark:fill-white"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
            </svg>
          </span>
        </form>

        <nav className="navbar w-full">
          <ul className="flex flex-col lg:flex-row">
            {
              pages.map((page, index) => (
                <li key={index} className="js-nav-dropdown group relative">

                  <button
                    className=" text-jacarta-700 font-display hover:text-accent focus:text-accent dark:hover:text-accent dark:focus:text-accent flex items-center justify-between py-3.5 text-base dark:text-white lg:px-5 w-full"
                  >
                    <Link className="shrink-0" href={page.path}>
                      <span
                        className={
                          isParentPageActive(page.pages, route.asPath)
                            ? "text-accent  dark:text-accent"
                            : ""
                        }
                      >
                        {page.name}
                      </span>
                    </Link>
                  </button>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </>
  );
}
