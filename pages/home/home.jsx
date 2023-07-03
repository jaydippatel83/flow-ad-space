import React from "react";
import {
  Auctions_categories,
  Feature_collections,
  NewseLatter,
  Partners,
  Top_collection,
} from "../../components/component";
import Meta from "../../components/Meta";
import Hero_4 from "../../components/hero/hero_4";
import CoverflowCarousel from "../../components/carousel/coverflowCarousel";

const HomePage = () => {
  return (
    <>
      <Meta title="Home" />
      <Hero_4 />
      <CoverflowCarousel />
      <Top_collection />
      <Auctions_categories />  
    </>
  );
};

export default HomePage;
