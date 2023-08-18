import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "./../../auth/userContext";

function Login() {
  const { setUserData } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/login",
        requestOptions
      );

      const data = await response.json();
      if (data.status === "failure") throw new Error(data.message);
      const { username, token } = data.data; //thats just how my API works
      console.log(data);
      setUserData((prev) => {
        return { ...prev, username, isAuthenticated: true, token };
      });
      toast.success("Logged in successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="relative flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-10 m-auto rounded-xl shadow-md md:max-w-xl  border-solid border-2 border-primary">
          <h1 className="text-3xl font-semibold text-center text-purple-700">
            Log in to start chattin!
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">
                <span className="text-base label-text">Email</span>
                {errors.email && (
                  <span className="label-text text-error">
                    Please enter a valid email
                  </span>
                )}
              </label>
              <input
                disabled={isLoading}
                type="text"
                placeholder="Email Address"
                className={`w-full input input-bordered input-primary disabled:bg-opacity-50 ${
                  errors.email && "input-error"
                }`}
                {...register("email", {
                  required: "Please enter an email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            <div>
              <label className="label">
                <span className="text-base label-text">Password</span>
                {errors.password && (
                  <span className="label-text text-error">
                    Please enter a password
                  </span>
                )}
              </label>
              <input
                disabled={isLoading}
                type="password"
                placeholder="Enter Password"
                className={`w-full input input-bordered input-primary disabled:bg-opacity-50 ${
                  errors.password && "input-error"
                }`}
                {...register("password", {
                  required: "Please enter a password",
                })}
              />
            </div>
            <div className="flex justify-center">
              <button
                className="btn btn-primary w-full disabled:opacity-100 disabled:bg-primary disabled:text-opacity-100"
                disabled={isLoading}
              >
                {isLoading && (
                  <span className=" loading loading-spinner"></span>
                )}
                Login
              </button>
            </div>
          </form>
          <span className="mt-2 inline-block">
            Don't have an account?
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 hover:underline ml-2"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}

export default Login;
