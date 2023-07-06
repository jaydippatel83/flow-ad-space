import React from "react"; 
import Image from "next/image";
import FilterCategoryItem from "../categories/filterCategoryItem";

const Collection_items = () => { 
  return (
    <>
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden"> 
          <Image
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
            layout="fill"
          />
        </picture>
        <div className="container">
          <FilterCategoryItem />
        </div>
      </section>
    </>
  );
};

export default Collection_items;
