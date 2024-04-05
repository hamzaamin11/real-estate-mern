import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    
  }, [window.location.search]);
  return (
    <div className="bg-slate-300 flex items-center justify-between p-2 px-10 pt-4">
      <div className="">
        <span className="text-slate-500 font-bold text-2xl">Real</span>
        <span className="text-slate-700 font-bold text-2xl">Estate</span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-100 flex items-center p-4 rounded-lg"
      >
        <input
          type="text"
          placeholder="Sreach..."
          className="focus:outline-none bg-transparent w-60 "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>
          <svg
            className="h-6"
            xmlns="http://www.w3.org/2000/svg"
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
          >
            <path
              d="M20.031,20.79c0.46,0.46,1.17-0.25,0.71-0.7l-3.75-3.76c1.27-1.41,2.04-3.27,2.04-5.31
        c0-4.39-3.57-7.96-7.96-7.96s-7.96,3.57-7.96,7.96c0,4.39,3.57,7.96,7.96,7.96c1.98,0,3.81-0.73,5.21-1.94L20.031,20.79z
        M4.11,11.02c0-3.84,3.13-6.96,6.96-6.96c3.84,0,6.96,3.12,6.96,6.96c0,3.84-3.12,6.96-6.96,6.96C7.24,17.98,4.11,14.86,4.11,11.02
        z"
            />
          </svg>
        </button>
      </form>
      <ul className="flex items-center gap-4">
        <Link to="/">
          <li className="text-slate-700 hover:underline cursor-pointer">
            Home
          </li>
        </Link>
        <Link to="/about">
          {" "}
          <li className="text-slate-700 hover:underline  cursor-pointer">
            About
          </li>
        </Link>

        <Link to="/profile">
          {currentUser ? (
            <img
              className="w-12 h-12 rounded-full"
              src={currentUser.avatar}
              alt="profile"
            />
          ) : (
            <li className="text-slate-700 hover:underline cursor-pointer">
              Sign Up
            </li>
          )}
        </Link>
      </ul>
    </div>
  );
};

export default Header;
