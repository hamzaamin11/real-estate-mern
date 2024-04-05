import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../Components/ListingItem";

const Search = () => {
  const [sidebarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log(showMore);
  const navigate = useNavigate();
  function handleChange(e) {
    e.preventDefault();
    if (
      e.target.name === "all" ||
      e.target.name === "rent" ||
      e.target.name === "sale"
    ) {
      setSideBarData({ ...sidebarData, type: e.target.name });
    }
    if (e.target.name === "searchTerm") {
      setSideBarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.name === "parking" ||
      e.target.name === "offer" ||
      e.target.name === "furnished"
    ) {
      setSideBarData({
        ...sidebarData,
        [e.target.name]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.name === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sidebarData, sort, order });
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("order", sidebarData.order);
    urlParams.set("sort", sidebarData.sort);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl || parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/Listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(data);
      setLoading(false);
    };
    fetchListings();
  }, [window.location.search]);
  const onShowMoreClick = async () => {
    const numberoflisting = listing.length;
    console.log("numberoflisting", numberoflisting);
    const startIndex = numberoflisting;
    console.log("startIndex", startIndex);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/Listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listing, ...data]);
  };
  return (
    <div className="flex flex-wrap">
      <div className="left ">
        <form onSubmit={handleSubmit} className="pt-20 pl-10">
          <div className="flex items-center gap-2 p-7">
            <label className="font-semibold">Search Term:</label>
            <input
              className="p-3 rounded-lg w-64"
              type="text"
              placeholder="search..."
              name="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex">
            <div className="flex items-center  gap-2 pl-7">
              <label className="pb-1 font-semibold">Type:</label>
              <div className="flex  gap-2 ">
                <input
                  type="checkbox"
                  name="all"
                  className="w-5"
                  checked={sidebarData.type === "all"}
                  onChange={handleChange}
                />
                <span className="pb-1">Rent & Sale</span>
              </div>
            </div>

            <div className="flex  gap-2 pl-3">
              <input
                type="checkbox"
                name="rent"
                className="w-5"
                checked={sidebarData.type === "rent"}
                onChange={handleChange}
              />
              <span className="pb-1">Rent</span>
            </div>

            <div className="flex  gap-2 pl-3">
              <input
                type="checkbox"
                name="sale"
                className="w-5"
                checked={sidebarData.type === "sale"}
                onChange={handleChange}
              />
              <span className="pb-1"> Sale</span>
            </div>

            <div className="flex  gap-2  pl-3">
              <input
                type="checkbox"
                name="offer"
                className="w-5"
                checked={sidebarData.offer}
                onChange={handleChange}
              />
              <span className="pb-1">Offer</span>
            </div>
          </div>
          <div className="flex pt-5">
            <div className="flex items-center  gap-2 pl-7">
              <label className="pb-1 font-semibold">Amenities:</label>
            </div>
            <div className="flex  gap-2  pl-3">
              <input
                type="checkbox"
                name="parking"
                className="w-5"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              <span className="pb-1">Parking</span>
            </div>
            <div className="flex  gap-2  pl-3">
              <input
                type="checkbox"
                name="furnished"
                className="w-5"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              <span className="pb-1">Furnished</span>
            </div>
          </div>
          <div className="pl-7 pt-5">
            <label className="pr-2 font-semibold">Sort:</label>
            <select
              className="border rounded-lg p-3"
              name="sort_order"
              onChange={handleSubmit}
              defaultValue={"created_at_desc"}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white px-32 uppercase p-2 mt-5 ml-5 rounded-lg hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="right">
        <div className="font-semibold text-3xl text-slate-700 p-3 border border-r-2 text-center">
          Listing result:
        </div>
        <div className="pt-7 flex flex-wrap flex-col">
          {!loading && listing.length === 0 && (
            <p className="text-2xl text-slate-700">No listing found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 pl-80">Loading...</p>
          )}
          <p className="flex items-center justify-between flex-wrap ">
            {!loading &&
              listing &&
              listing.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
          </p>
        </div>
        {showMore && (
          <button
            onClick={onShowMoreClick}
            className="text-green-700 hover:underline p-7 text-lg pl-[550px]"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
