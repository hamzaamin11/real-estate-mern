import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";
// import { saveinLs } from "../Helper";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        navigate("/signup");
        return;
      }
      // console.log("updated data", data);
      // axios("http://localhost:5000/api/auth/signup", data)
      //   .then((res) => {
      //     console.log("what is res", res);
      //     saveinLs("Tokenjwt",res.data.token)
      //     navigate("/")
      //   })
      //   .catch((error) => {
      //     alert("this password in invaild");
      //   });

      setLoading(false);
      setError(null);
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  useEffect(() => {
    document.title = "Mern Estate/SignUp";
  }, []);
  return (
    <div className="pt-16">
      <h1 className="text-2xl font-bold text-center p-6">sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          placeholder="User Name"
          name="username"
          className="border p-2 rounded-lg w-72"
          onChange={handleChange}
        />
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
            {loading ? "loading..." : "SIGN UP"}
          </button>
        </div>
      </form>
      <Link to="/signin">
        <div className="text-center pt-1 pr-28">
          <span>Have an account?</span>
          <span className="pl-1 text-blue-400"> signIn</span>
        </div>
      </Link>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default SignUp;
