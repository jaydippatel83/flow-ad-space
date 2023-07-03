import React from "react";
import { HeadLine } from "../component"; 
import Image from "next/image";

const Browse_category = ({ bgWhite }) => {
  return (
    <div>
      <section className={bgWhite ? "pt-24 pb-16 relative" : "py-24 relative"}>
        {bgWhite && (
          <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
            <Image
              src="/images/gradient_light.jpg"
              alt="gradient"
              className="h-full"
              layout="fill"
            />
          </picture>
        )}
        <HeadLine
          text="Browse by category"
          classes="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white"
        />

        <div className="relative"> 
        </div>
      </section>
    </div>
  );
};

export default Browse_category;
