import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, Ally } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { coverflow_data } from "../../data/coverflow_data";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";

const CoverflowCarousel = () => {

  const [userData,setUserData]= useState([]);

  const getUsers= async()=>{
    const arry =[];
		const q = query(collection(db, "Users"));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((fire) => { 
			const id = fire.id;
      arry.push({ ...fire.data(), id })  
		})
    setUserData(arry);
  }

  useEffect(()=>{
    getUsers();
  },[])

  return (
    <> 
      <div className="relative px-6 pb-16 sm:px-0"> 
        <Swiper
          breakpoints={{ 
            100: { 
              slidesPerView: 1,
            },
            575: { 
              slidesPerView: 3,
            }, 
            992: { 
              slidesPerView: 5,
            },
          }}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={5}
          loop={true}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Navigation]}
          navigation={{
            nextEl: ".swiper-button-next-4",
            prevEl: ".swiper-button-prev-4",
          }}
          className="swiper coverflow-slider !py-5"
        >
          {userData &&  userData.map((user) => {
            const {UserName, Photo, Cover,CreatedAt, id}= user; 
            return (
              <SwiperSlide key={id}>
                <article>
                  <div className="block overflow-hidden rounded-2.5xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-jacarta-700">
                    <figure className="relative">
                      <Link href={"/user/" + id}>
                        <a>
                          <Image
                            src={Cover ? Cover : Photo}
                            alt={UserName}
                            className="swiper-lazy h-[430px] w-full object-cover"
                            height="430"
                            width="379"
                          />
                        </a>
                      </Link>
                    </figure>
                    <div className="p-6">
                      <div className="flex">
                        <Link href={"/user/" + id}>
                          <a className="shrink-0">
                            <img
                              src={Photo}
                              alt="avatar"
                              className="mr-4 h-10 w-10 rounded-full"
                            />
                          </a>
                        </Link>
                        <div>
                          <Link href={"/user/" + id}>
                            <a className="block">
                              <span className="font-display text-lg leading-none text-jacarta-700 hover:text-accent dark:text-white">
                                {UserName}
                              </span>
                            </a>
                          </Link>
                          <Link href={"/user/" + id}>
                            <a className="text-2xs text-accent">{UserName}</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="swiper-button-prev-4 group absolute top-1/2 left-4 z-10 -mt-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl shadow-white-volume">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-jacarta-700 group-hover:fill-accent"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" />
          </svg>
        </div>
        <div className="swiper-button-next-4 group absolute top-1/2 right-4 z-10 -mt-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white p-3 text-jacarta-700 text-xl shadow-white-volume">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="fill-jacarta-700 group-hover:fill-accent"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
          </svg>
        </div>

        {/* <!-- end coverflow slider --> */}
      </div>
    </>
  );
};

export default CoverflowCarousel;
