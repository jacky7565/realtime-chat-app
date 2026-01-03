import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

let Form = () => {
  let navigate = useNavigate();
  let inputVal = { name: "", email: "", phone: "", password: "", image: null };
  let [inVal, setInVal] = useState(inputVal);
  let [error, setErrors] = useState({});
  let [imageVal, setImageVal] = useState(null);

  let API = import.meta.env.VITE_API_BASE_URL;
  let [previousImage, setPreviousImage] = useState(null);

  let handleChange = (e) => {
    let { name, value, files } = e.target;

    if (name == "image") {
      let fileName = files[0];
      let imageSize = fileName.size;
      let acceptSize = 1 * 1024 * 1024;
      let imageType = fileName.name.split(".").pop().toLowerCase();
      let check = ["jpg", "jpeg", "png", "gif"];
      let imageErr = "";

      if (!check.includes(imageType)) {
        imageErr = "Only JPG, PNG, GIF files are allowed!";
      } else if (imageSize > acceptSize) {
        imageErr = "File size must be less than 1MB!";
      }
      setImageVal(imageErr);

      setInVal((prev) => {
        return { ...prev, image: fileName };
      });
      if (imageErr == "") {
        let tempFile = URL.createObjectURL(fileName);
        setPreviousImage(tempFile);
      }
    } else {
      setInVal((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  let validateForm = () => {
    let err = {};
    if (!inVal.name.trim()) {
      err.name = "Name is required";
    } else if (inVal.name.length < 2) {
      err.name = "Name must be at least 3 characters";
    }
    if (!inVal.email.trim()) {
      err.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inVal.email)) {
      err.email = "Enter valid email";
    }
    if (!inVal.phone.trim()) {
      err.phone = "Number is required";
    } else if (!/^\d{10}$/.test(inVal.phone)) {
      err.phone = "Enter valid phone number";
    }

    if (!inVal.password.trim()) {
      err.password = "Password is required";
    } else if (inVal.password < 5) {
      err.password = "Enter minimum five character";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  let submitHandler = (e) => {
    e.preventDefault();
    let checkVal = validateForm();

    if (!inVal.image) {
      setImageVal("Image is required");
      checkVal = false;
    }

    if (checkVal) {
      let submit = async () => {
        let formData = new FormData();
        formData.append("name", inVal.name);
        formData.append("email", inVal.email);
        formData.append("phone", inVal.phone);
        formData.append("password", inVal.password);
        formData.append("image", inVal.image);
        try {
          let submitData = await axios.post(`${API}/create`, formData, {
            withCredentials: true,
          });
          if (submitData.data.success) {
            toast.success(submitData.data.message);
            setInVal(inputVal);
            setImageVal(null);
            setPreviousImage(null);
            navigate("/login");
          } else {
            toast.error(submitData.data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      };
      submit();
      console.log("submit form", inVal);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={submitHandler}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          User registation
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={inVal.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.name && (
            <span className="text-red-700 text-sm mt-10">{error.name}</span>
          )}
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={inVal.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.email && (
            <span className="text-red-700 text-sm mt-10">{error.email}</span>
          )}
        </div>

        <div className="mb-6">
          <input
            type="number"
            name="phone"
            placeholder="Enter your number"
            value={inVal.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.phone && (
            <span className="text-red-700 text-sm mt-10">{error.phone}</span>
          )}
        </div>

        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={inVal.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error.password && (
            <span className="text-red-700 text-sm mt-10">{error.password}</span>
          )}
        </div>

        <div className="mb-6">
          <label className="bg-white text-slate-500 font-semibold text-base rounded max-w-md h-30 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto">
            {previousImage ? (
              <img
                src={previousImage}
                alt="preview"
                style={{ width: "100px", height: "100px" }}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-11 mb-3 fill-gray-500"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
            )}
            Upload file
            <input
              type="file"
              name="image"
              id="uploadFile1"
              className="hidden"
              onChange={handleChange}
            />
            <p className="text-xs font-medium text-slate-400 mt-2">
              PNG, JPG and GIF are Allowed.
            </p>
          </label>
          {imageVal && (
            <span className="text-red-700 text-sm mt-10">{imageVal}</span>
          )}
        </div>

        <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
