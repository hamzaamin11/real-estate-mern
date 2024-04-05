import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { saveinLs } from "../Helper";
import { useNavigate } from "react-router-dom";
import { signInFailure, signInSuccess, signInStart } from "../redux/UserSlice";
import OAuth from "../Components/OAuth";

const SignIn = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleChange = (e) => {
    e.preventDefault();
    const names = e.target.name;
    const updateVal = e.target.value;
    setFormData({ ...formData, [names]: updateVal });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      console.log("username", data.username);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        navigate("/signin");
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  useEffect(() => {
    document.title = "Mern Estate/SignIn";
  }, []);
  return (
    <div className="pt-16">
      <h1 className="text-2xl font-bold text-center p-6">sign In</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          placeholder="Email"
          name="email"
          className="border p-2 rounded-lg w-72"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="border p-2 rounded-lg w-72"
          onChange={handleChange}
        />
        <div>
          <button
            disabled={loading}
            className="w-72 bg-slate-700 rounded-lg text-white p-2 hover:opacity-95 disabled:opacity-75"
          >
            {loading ? "loading..." : "SIGN IN"}
          </button>
        </div>
        <OAuth />
      </form>
      <Link to="/signup">
        <div className="text-center pt-2 pr-16">
          <span>Dont have an account?</span>
          <span className="pl-1 text-blue-400"> signUp</span>
        </div>
      </Link>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default SignIn;
