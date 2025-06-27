import React, { useState } from 'react'
import { img } from '../assets/images';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosinstance } from '../lib/axios';
import { Link } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const queryclient = useQueryClient()


  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const response = await axiosinstance.post("/user/login", { email, password })
      return response.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["authuser"] });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      mutate()
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600">
      <div className="bg-white rounded-3xl shadow-2xl flex max-w-4xl w-full overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex items-center mb-8">
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-wide drop-shadow-lg">
              <span className="mr-2">💬</span>Chit-Chat
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4 bg-blue-400">
              <span>
                {error.response?.data?.message || "An unexpected error occurred. Please try again."}
              </span>
            </div>
          )}



          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-gray-500 mb-6">Join the conversation and do Chit-Chat!</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
            >
              {isPending ? "Login in....." : "Login"}
            </button>
          </form>
          <div className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link className="text-purple-600 hover:underline font-semibold" to="/signup">
              Signup
            </Link>
          </div>
        </div>
        {/* Right: Image */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-blue-400 to-purple-500 items-center justify-center">
          <img
            src={img.signupimg}
            alt="Signup"
            className="w-4/5 max-h-[400px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Login
