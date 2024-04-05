import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SwiperSlide, Swiper } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import ListingItem from "../Components/ListingItem";
const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [offerRent, setOfferRent] = useState([]);
  const [offerSale, setOfferSale] = useState([]);

  useEffect(() => {
    const fetchOfferListins = async () => {
      try {
        const res = await fetch(`/api/Listing/get?offer=true&limit=3`);
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log("Error", error);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch(`/api/Listing/get?type=rent&limit=3`);
        const data = await res.json();
        setOfferRent(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch(`/api/Listing/get?type=sale&limit=3`);
        const data = await res.json();
        setOfferSale(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListins();
  }, []);
  return (
    <div>
      {/* top */}
      <div className=" flex flex-col gap-6 pt-28 pb-10 px-3 ">
        <h1 className="text-slate-700  font-bold text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-gray-400 text-sm">
          Mern Estate is the best to find your next perfect place to live.
          <br /> we have wide place of properties for you to choose from.
        </div>
        <Link
          className="text-sm text-blue-800 hover:underline font-semibold"
          to={"/search"}
        >
          Let's Start now...
        </Link>
      </div>
      {/* swiper */}

      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide>
              <div
                key={listing._id}
                className="h-[500px] "
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing */}
      <div className="">
        <div className="pt-10 pl-16">
          <h2 className="text-2xl font-semibold text-slate-600">
            Recent offer
          </h2>
          <Link
            className="text-blue-800 text-sm hover:underline"
            to={"/search?offer=true"}
          >
            Show more offers
          </Link>
        </div>
        <div className="flex flex-wrap">
          {offerListing &&
            offerListing.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
        </div>
      </div>
      <div className="">
        <div className="pt-10 pl-16">
          <h2 className="text-2xl font-semibold text-slate-600">
            Recent places for rent
          </h2>
          <Link
            className="text-blue-800 text-sm hover:underline"
            to={"/search?type=rent"}
          >
            Show more place for rent
          </Link>
        </div>
        <div className="flex flex-wrap">
          {offerRent &&
            offerRent.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
        </div>
      </div>
      <div className="">
        <div className="pt-10 pl-16">
          <h2 className="text-2xl font-semibold text-slate-600">
            Recent more places for sale
          </h2>
          <Link
            className="text-blue-800 text-sm hover:underline"
            to={"/search?offer=true"}
          >
            Show more places for sale
          </Link>
        </div>
        <div className="flex flex-wrap">
          {offerSale &&
            offerSale.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
