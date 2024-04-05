
import { Link } from "react-router-dom";

const ListingItem = ({ listing }) => {
  return (
    <div className="flex">
      <div className=" ">
        <div className="bg-white m-5 ml-20  shadow-md hover:shadow-lg overflow-hidden rounded-lg w-[320px]">
          <Link to={`/listing/${listing._id}`}>
            <img
              className="   py-5 object-cover  hover:scale-105 transition-scale duration-300"
              src={listing.imageUrls[0]}
              alt="image"
            />
          </Link>
          <div className="pl-3">
            <p className=" truncate w-[230px] text-lg font-semibold text-slate-700">
              {listing.name}
            </p>
          </div>
          <div className="flex items-center   truncate w-[230px] ">
            <svg
              className="h-5"
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
            <p className="pb-2 pt-1  text-slate-700">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 pl-2 line-clamp-2 ">
            {listing.description}
          </p>
          <p className="text-slate-500 font-semibold p-2">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}
            {listing.type === "rent" && "/month"}
            {listing.type === "sale" && "/price"}
          </p>
          <div className="flex items-center pb-2 gap-4">
            <div className="text-slate-700 font-semibold pl-3  text-sm ">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="text-slate-700 font-semibold text-sm ">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
