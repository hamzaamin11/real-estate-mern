import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../FireBase";
import { useSelector } from "react-redux";
const UpdateList = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [imageUploadError, setImageUploadError] = useState(null);
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length < 7 + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        // storeImage is a simple function made by myself
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);

          // concat method 2 string ko jo array mn join krny k lia use krty ha aur id hum nayi r purani img of array k andr store rakh sakty ha
          // setFormData({ ...formData, imageUrls:urls });
          // is method sy hum naye image ko remove kr daty hy
        })
        .catch((err) => {
          setImageUploadError("Image Upload is failed (2 mb max per image)");
        });
    } else setImageUploadError("You are only upload 6 images per listing");
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = file.name + new Date().getTime();
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  useEffect(() => {
    const fetchListing = async () => {
      const listingid = params.listingid;
      const res = await fetch(`/api/Listing/get/${listingid}`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(error.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
    document.title = "Mern Estate/UpdatedListing";
  }, []);
  const handleRemoveImage = (id) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((val, index) => index !== id),
    });
  };
  const handleChange = (e) => {
    if (e.target.name === "sale" || e.target.name === "rent") {
      setFormData({ ...formData, type: e.target.name });
    }
    if (
      e.target.name === "parking" ||
      e.target.name === "furnished" ||
      e.target.name === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls < 1) {
        return setError("you have must be upload atleast one image");
      }
      setLoading(true);
      const res = await fetch(`/api/Listing/update/${params.listingid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/Listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main>
      <h1 className="text-3xl font-semibold text-center pt-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex">
        <div className="flex flex-col items-center pt-8 gap-6 w-[750px]">
          <input
            className="p-4 w-96 rounded-lg"
            type="text"
            placeholder="Name"
            name="name"
            maxLength="62"
            minLength="10"
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            className=" w-96 rounded-lg"
            type="textarea"
            placeholder="Description"
            name="description"
            maxLength="62"
            minLength="10"
            onChange={handleChange}
            value={formData.description}
          />
          <input
            className="p-4 w-96 rounded-lg"
            type="text"
            placeholder="Address"
            name="address"
            maxLength="62"
            minLength="10"
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex flex-wrap">
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                name="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="pr-2">Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                name="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="pr-2">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                name="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="pr-2">Parking Shot</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                name="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="pr-2">Furnished</span>
            </div>
          </div>
          <div className=" flex gap-2 self-start pl-[190px]">
            <input
              className="w-5"
              type="checkbox"
              name="offer"
              onChange={handleChange}
              checked={formData.offer}
            />
            <span className="pr-2">Offer</span>
          </div>
          <div className=" flex gap-4 pr-28">
            <div className="flex items-center self-start gap-2">
              <input
                className="w-14 p-2 border border-gray-400 rounded-lg"
                type="number"
                name="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Bedrooms</span>
            </div>
            <div className="flex items-center self-start gap-2">
              <input
                className="w-14 p-2 border border-gray-400 rounded-lg"
                type="number"
                name="bathrooms"
                min="1"
                max="4"
                required
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <span>Baths</span>
            </div>
          </div>

          <div className="flex items-center pr-[140px] gap-2">
            <input
              className="w-20 p-2  border border-gray-400 rounded-lg"
              type="number"
              name="regularPrice"
              min="50"
              max="100000"
              onChange={handleChange}
              value={formData.regularPrice}
              required
            />

            <div className="flex flex-col items-center">
              <span>Regular price</span>
              <p className="text-xs">($ / Month)</p>
            </div>
          </div>

          {formData.offer && (
            <div className="flex items-center pr-[110px] pb-5 gap-2">
              <input
                className="w-20 p-2 border border-gray-400 rounded-lg"
                type="number"
                name="discountPrice"
                min="0"
                max="100000"
                onChange={handleChange}
                value={formData.discountPrice}
                required
              />
              <div className="flex flex-col items-center">
                <span>Discounted price</span>
                <p className="text-xs">($ / Month)</p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-10">
          <div className="flex items-center gap-1 pl-3 pb-2">
            <p className="font-semibold">Image:</p>
            <span className="font-normal text-gray-500">
              This first image will be the cover (max 6)
            </span>
          </div>

          <div className="flex items-center">
            <div className="  border p-3 m-2 rounded-lg">
              <input
                type="file"
                id="image"
                accept="image/*"
                multiple
                className="border-gray-500 rounded w-full"
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>
            <div className="border  border-green-700 w-auto rounded-lg">
              <button
                disabled={uploading}
                type="button"
                onClick={handleImageSubmit}
                className="text-green-700 p-3  hover:shadow-lg hover:opacity-95"
              >
                {uploading ? "UPLOADING..." : "UPLOAD"}
              </button>
            </div>
          </div>
          {/* 
    Yeh code imageUploadError && imageUploadError ko point karta hai. 
    Agar pehla expression truthy hai, toh doosra expression render hoga.
    Agr pehla expression falsy hai, toh doosra expression ignore hoga.
  */}
          <p className="text-red-700 text-xs pl-20 py-1">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, id) => (
              <div className="flex justify-between p-3 my-2 border" key={id}>
                <img
                  src={url}
                  alt="create-image"
                  className="w-20 h-20 object-cover rounded-lg "
                />
                <div>
                  <button
                    type="button"
                    className="p-5 text-red-700 hover:opacity-75 uppercase"
                    onClick={() => handleRemoveImage(id)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          <div className="">
            <button
              className="bg-slate-700 text-white p-3 px-[150px] uppercase ml-2 rounded-lg text-center hover:opacity-95 disabled:opacity-85"
              disabled={loading || uploading}
            >
              {loading ? "updating..." : "Update Listing"}
            </button>

            {error && (
              <p className="text-red-700 text-sm pt-4 text-center">{error}</p>
            )}
          </div>
        </div>
      </form>
    </main>
  );
};

export default UpdateList;
