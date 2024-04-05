import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { useSelector } from "react-redux";
import Contact from "./Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [Listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);
  console.log(currentUser?._id, Listing);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/Listing/get/${params.listingid}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchListing();
  }, []);
  console.log(loading);
  return (
    <main>
      {loading && <p className="text-center text-2xl p-7">Loading...</p>}
      {error && (
        <p className="text-center text-2xl p-7">Something went wrong!</p>
      )}
      {Listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {Listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className=" pl-48 p-5 font-semibold text-xl">
        {Listing && Listing.name} - $ {Listing && Listing.regularPrice.toLocaleString()}/ month
      </div>
      <div className="flex gap-1 pl-48 ">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M12,21.933a1.715,1.715,0,0,1-1.384-.691L5.555,14.5a7.894,7.894,0,1,1,12.885-.009L13.385,21.24A1.717,1.717,0,0,1,12,21.933ZM11.992,3.066A6.81,6.81,0,0,0,7.414,4.815a6.891,6.891,0,0,0-1.05,9.1l5.051,6.727a.725.725,0,0,0,.584.292h0a.732.732,0,0,0,.586-.292l5.044-6.734A6.874,6.874,0,0,0,12.81,3.113,7.277,7.277,0,0,0,11.992,3.066Z" />
              <path d="M12,12.5A2.5,2.5,0,1,1,14.5,10,2.5,2.5,0,0,1,12,12.5Zm0-4A1.5,1.5,0,1,0,13.5,10,1.5,1.5,0,0,0,12,8.5Z" />
            </g>
          </svg>
        </div>
        {Listing && Listing.address}
      </div>
      <div className="flex gap-2 pl-48 pt-5">
        <div className="bg-red-900 max-w-[150px] cursor-pointer text-center  w-full rounded-md">
          <p className="p-2 text-white">
            {Listing && Listing.type === "rent" ? "For Rent" : "For Sale"}
          </p>
        </div>
        <div>
          {Listing && Listing.offer && (
            <p className="p-2 text-white cursor-pointer bg-green-900 max-w-[200px] text-center w-full rounded-md">
              ${Listing.regularPrice - Listing.discountPrice} Discount
            </p>
          )}
        </div>
      </div>
      <div className="flex   pl-[188px] pt-6 ">
        <span className="font-semibold text-black flex gap-1">
          Description - <p className=""> </p>
        </span>
        <p className="text-slate-700 text-md max-w-[850px] ">
          {Listing && Listing.description}
        </p>
      </div>
      <ul className="flex items-center">
        <li className="h-4 pl-[185px] pt-4 flex items-center gap-1 text-green-900 font-semibold text-sm ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon h-6 font-extrabold text-black cursor-pointer "
            viewBox="0 0 512 512"
          >
            <path
              d="M384 240H96V136a40.12 40.12 0 0140-40h240a40.12 40.12 0 0140 40v104zM48 416V304a64.19 64.19 0 0164-64h288a64.19 64.19 0 0164 64v112"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <path
              d="M48 416v-8a24.07 24.07 0 0124-24h368a24.07 24.07 0 0124 24v8M112 240v-16a32.09 32.09 0 0132-32h80a32.09 32.09 0 0132 32v16M256 240v-16a32.09 32.09 0 0132-32h80a32.09 32.09 0 0132 32v16"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
          </svg>
          <p className="text-sm cursor-pointer">
            {Listing && Listing.bedrooms > 1
              ? `Beds${Listing && Listing.bedrooms}`
              : `Bed${Listing && Listing.bedrooms}`}
          </p>
        </li>
        <li className="flex  gap-1 text-green-900 font-semibold pt-4 pl-4 ">
          <svg
            className="h-6 my-[-6px] cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M96 77.3c0-7.3 5.9-13.3 13.3-13.3c3.5 0 6.9 1.4 9.4 3.9l14.9 14.9C130 91.8 128 101.7 128 112c0 19.9 7.2 38 19.2 52c-5.3 9.2-4 21.1 3.8 29c9.4 9.4 24.6 9.4 33.9 0L289 89c9.4-9.4 9.4-24.6 0-33.9c-7.9-7.9-19.8-9.1-29-3.8C246 39.2 227.9 32 208 32c-10.3 0-20.2 2-29.2 5.5L163.9 22.6C149.4 8.1 129.7 0 109.3 0C66.6 0 32 34.6 32 77.3V256c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H96V77.3zM32 352v16c0 28.4 12.4 54 32 71.6V480c0 17.7 14.3 32 32 32s32-14.3 32-32V464H384v16c0 17.7 14.3 32 32 32s32-14.3 32-32V439.6c19.6-17.6 32-43.1 32-71.6V352H32z" />
          </svg>
          <p className="text-sm cursor-pointer">
            {Listing && Listing.bathroom > 1
              ? `baths${Listing && Listing.bathrooms}`
              : `Bath${Listing && Listing.bathrooms}`}
          </p>
        </li>

        <li className="flex items-center pl-3 pt-4">
          <svg
            className="h-10 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M12,21.933A9.933,9.933,0,1,1,21.933,12,9.944,9.944,0,0,1,12,21.933ZM12,3.067A8.933,8.933,0,1,0,20.933,12,8.943,8.943,0,0,0,12,3.067Z" />
              <path d="M12.569,8.5h-1.75a.749.749,0,0,0-.75.75v5.74a.5.5,0,0,0,.5.5.5.5,0,0,0,.5-.5V13.5h1.5a2.5,2.5,0,0,0,0-5Zm0,4h-1.5v-3h1.5a1.5,1.5,0,0,1,0,3Z" />
            </g>
          </svg>
        </li>
        <p className="font-semibold text-green-900 pt-3 pl-1 text-sm cursor-pointer">
          {Listing && Listing.parking === true ? "Parking spot" : "No Parking"}
        </p>
        <li className="flex items-center -mx-5 pt-3 gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M248 48V256h48V58.7c23.9 13.8 40 39.7 40 69.3V256h48V128C384 57.3 326.7 0 256 0H192C121.3 0 64 57.3 64 128V256h48V128c0-29.6 16.1-55.5 40-69.3V256h48V48h48zM48 288c-12.1 0-23.2 6.8-28.6 17.7l-16 32c-5 9.9-4.4 21.7 1.4 31.1S20.9 384 32 384l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32V384H352v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384c11.1 0 21.4-5.7 27.2-15.2s6.4-21.2 1.4-31.1l-16-32C423.2 294.8 412.1 288 400 288H48z" />
            </g>
          </svg>
          <svg
            className="h-6 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M248 48V256h48V58.7c23.9 13.8 40 39.7 40 69.3V256h48V128C384 57.3 326.7 0 256 0H192C121.3 0 64 57.3 64 128V256h48V128c0-29.6 16.1-55.5 40-69.3V256h48V48h48zM48 288c-12.1 0-23.2 6.8-28.6 17.7l-16 32c-5 9.9-4.4 21.7 1.4 31.1S20.9 384 32 384l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32V384H352v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384c11.1 0 21.4-5.7 27.2-15.2s6.4-21.2 1.4-31.1l-16-32C423.2 294.8 412.1 288 400 288H48z" />
          </svg>
          <p className="text-green-900 font-semibold text-sm cursor-pointer">
            {Listing && Listing.furnished === true
              ? "Furnished"
              : "Not Furnished"}
          </p>
        </li>
      </ul>
      {currentUser &&
        Listing &&
        currentUser._id !== Listing.userRef &&
        !contact && (
          <div className="text-center pt-1">
            <button
              onClick={() => setContact(true)}
              className="bg-slate-700 text-white px-[400px] p-3 rounded-lg hover:opacity-90 uppercase"
            >
              Contact landlord
            </button>
          </div>
        )}
      {contact && <Contact listing={Listing} />}
    </main>
  );
};

export default Listing;
