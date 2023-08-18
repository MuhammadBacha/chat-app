import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "./../../auth/userContext";

function Signup() {
  const [loading, setLoading] = useState(false);
  const { setUserData } = useAuthContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async ({ username, email, password }) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    };
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/signup",
        requestOptions
      );

      const data = await response.json();
      if (data.status === "failure") throw new Error(data.message);
      const { username, token } = data.data;
      setUserData((prev) => {
        return { ...prev, username, isAuthenticated: true, token };
      });
      toast.success("Signed up successfully");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const password = watch("password"); // Get value of password field

  return (
    <div className="relative flex flex-col justify-center h-screen overflow-hidden">
      <div className="w-full p-6 m-auto shadow-md lg:max-w-xl border-solid border-2 border-primary rounded-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700">
          Sign up here
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="label">
              <span className="text-base label-text">Username</span>
              {errors.username && (
                <span className="label-text text-error">
                  {errors.username.message}
                </span>
              )}
            </label>
            <input
              disabled={loading}
              type="text"
              placeholder="Username"
              className={`w-full input input-bordered input-primary ${
                errors.username && "input-error"
              }`}
              {...register("username", {
                required: "Please enter a username.",
              })}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              <span className="text-base label-text">Email</span>
              {errors.email && (
                <span className="label-text text-error">
                  {errors.email.message}
                </span>
              )}
            </label>
            <input
              disabled={loading}
              type="text"
              id="email"
              placeholder="Email Address"
              className={`w-full input input-bordered input-primary ${
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
                  {errors.password.message}
                </span>
              )}
            </label>
            <input
              disabled={loading}
              type="password"
              placeholder="Enter Password"
              className={`w-full input input-bordered input-primary ${
                errors.password && "input-error"
              }`}
              {...register("password", { required: "Please enter a password" })}
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text">Confirm Password</span>
              {errors.confirmPassword && (
                <span className="label-text text-error">
                  {errors.confirmPassword.message}
                </span>
              )}
            </label>
            <input
              disabled={loading}
              type="password"
              placeholder="Confirm Password"
              className={`w-full input input-bordered input-primary ${
                errors.confirmPassword && "input-error"
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </div>
          <div>
            <button
              className="btn btn-block btn-primary disabled:opacity-100 disabled:bg-primary disabled:text-opacity-100"
              disabled={loading}
            >
              {loading && <span className=" loading loading-spinner"></span>}
              Sign Up
            </button>
          </div>
          <span className="inline-block mt-2">
            Already have an account ?
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 hover:underline ml-2"
            >
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Signup;
