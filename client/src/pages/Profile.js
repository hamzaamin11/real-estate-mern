import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../FireBase";
import {
  deleteUserError,
  deleteUserStart,
  deleteUserSuccess,
  signOutError,
  signOutStart,
  signOutSuccess,
  updateUserError,
  updateUserStart,
  updateUserSuccess,
} from "../redux/UserSlice";

// firebase storage
// allow read;
// allow write:if request.resource.size< 2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')
const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const { error, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    // its means that is code is for to store the img in firebase app that is exported
    const storage = getStorage(app);
    // this code is for there is no chance to upload img same name that is single name for every img nd also set time laptop
    const fileName = file.name + new Date();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_change",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
        setFileUploadError(false);
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  // "its means that mn state is andr sy currentUser ki value get kr ra"that is called destructring...
  const { currentUser } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("update data", data);
      if (data.success === false) {
        dispatch(updateUserError(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserError(error.message));
      setFileUploadError(true);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("deleted data", data);
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      deleteUserError(error);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout", {
        method: "GET",
      });
      const data = await res.json();
      console.log("data", data);
      if (data.success === false) {
        console.log("response", data);
        dispatch(signOutError(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutError(error.message));
    }
  };
  const handleShowListings = async (e) => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(data.message);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(error.message);
    }
  };
  const handleListingDelete = async (listingID) => {
    try {
      const res = await fetch(`/api/Listing/delete/${listingID}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        console.log(error.message);
        return;
      }
      setUserListing(
        (prev) => prev.filter((listing) => listing._id !== listingID),
        {
          /*
Yahan setUserListing ek functional update pattern ka use kar raha hai, jismein prev parameter ke through previous state ko represent kiya jata hai. Is code ka kaam hai user ke listings mein se unhein filter karke, jiska _id (listing ID) listingID ke equal nahi hai, wohi listings ko naya state ke roop mein set karna.
Yani ki, agar prev mein koi listing hai jiska _id listingID ke equal hai, to woh listing nahi include hoga naye state mein. Isse essentially listingID ke corresponding listing ko user ke listings se remove kar diya jayega.*/
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <h1 className="text-center font-semibold text-3xl pt-7">Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <div className="pl-[47%] pt-2">
          <img
            onClick={() => fileRef.current.click()}
            className="rounded-full w-20 h-20 "
            src={formData.avatar || currentUser.avatar}
            alt="profile"
          />
        </div>
        <div className="text-center text-sm pt-4">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload(image must be less than 2mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`uploading${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center flex-col">
          <div className="py-6 ">
            <input
              className="p-4 w-80 border rounded-lg"
              type="text"
              placeholder="username"
              name="username"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
          </div>
          <div className="">
            <input
              className="p-4 w-80 border rounded-lg"
              type="email"
              placeholder="email"
              name="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
          </div>
          <div className="py-6 ">
            <input
              className="p-4 w-80 border rounded-lg"
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div className="pb-3">
            <button
              disabled={loading}
              className="bg-slate-700  text-white w-[320px] rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "loading..." : "update"}
            </button>
          </div>
          <NavLink
            to="/create-Listing"
            className="bg-green-700 border text-white hover:opacity-95   p-2 px-28 rounded-lg uppercase"
          >
            Create listing
          </NavLink>
        </div>
      </form>

      <div className=" py-3">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer pl-[37%] "
        >
          Delete account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer pl-[155px] "
        >
          Sign out
        </span>
      </div>

      <p className="text-red-700 text-sm pl-[40%]">
        {" "}
        {error ? error.message : ""}
      </p>
      <p className="text-green-700 text-sm pl-[45%]">
        {updateSuccess ? "User is updated succcessfully!" : ""}
      </p>
      <div className="text-center">
        <button onClick={handleShowListings} className="text-green-700 ">
          Show listings
        </button>
      </div>
      {showListingError && (
        <p className="text-red-700 text-sm">{showListingError}</p>
      )}

      {userListing && userListing.length > 0 && (
        <p className="text-center text-2xl font-semibold pt-7 pb-2">
          Your Listings
        </p>
      )}
      {userListing.map((listing) => (
        <div
          className="flex items-center border w-96 justify-between my-3 ml-[430px]"
          key={listing._id}
        >
          <Link to={`/Listing/${listing._id}`}>
            <img
              src={listing.imageUrls[0]}
              alt="image"
              className="w-20 h-20 object-contain"
            />
          </Link>
          <Link to={`/Listing/${listing._id}`}>
            <div className="text-slate-700 font-semibold hover:underline truncate ">
              {listing.name}
            </div>
          </Link>
          <div className="flex flex-col m-2 ">
            <button
              onClick={() => handleListingDelete(listing._id)}
              className="text-red-700 uppercase "
            >
              delete
            </button>
            <Link to={`/Update-Listing/${listing._id}`}>
              <button className="text-green-700 uppercase">edit</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
