import { useState } from 'react';
import { motion } from 'framer-motion';

import { blueTextBottom, submitForm } from './login/functions';
import { hideInvalidate, showInvalidate } from './login/validation';
import { Link } from 'react-router-dom';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [notice, setNotice] = useState('');

  return (
    <>
      <div
        className='min-h-screen bg-no-repeat bg-cover bg-center'
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2017/12/05/16/34/maple-2999706_1280.jpg')",
        }}
      >
        <motion.div className='flex justify-end'>
          <motion.div className='bg-red-50 min-h-screen w-1/2 flex justify-center items-center'>
            <div className=''>
              <form
                onSubmit={(e) =>
                  submitForm(e, isRegistering, setNotice, setIsRegistering)
                }
              >
                <div>
                  <motion.span
                    layout='position'
                    className='font-semibold text-4xl mx-auto select-none mb-2 '
                  >
                    <h1 className='text-2xl font-bold'>
                      {isRegistering
                        ? 'Sign up for new'
                        : 'Login to your account'}
                    </h1>
                  </motion.span>
                </div>

                <div className='flex flex-col gap-5 mt-5'>
                      {/* Input Password */}
                      <div className='flex flex-col'>
                        <label
                          className='block text-md mb-2'
                          htmlFor='password'
                        >
                          Password
                        </label>
                        <input
                          className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                          type='password'
                          name='password'
                          placeholder='Password'
                          onInvalid={showInvalidate}
                          onInput={hideInvalidate}
                          required
                        />
                      </div>

                      {/* Input Username */}
                      <div className='flex flex-col'>
                        <label
                          className='block text-md mb-2'
                          htmlFor='username'
                        >
                          Username
                        </label>
                        <input
                          className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                          type='text'
                          name='username'
                          placeholder='Username'
                          onInvalid={showInvalidate}
                          onInput={hideInvalidate}
                          required
                        />
                      </div>
                  {!isRegistering ? (
                    <>

                      {/* Forgot Password Link */}
                      <div className='text-right'>
                        <Link
                          to='/forgot'
                          className='text-sm text-blue-500 underline cursor-pointer'
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                     
                    <div className="grid grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div className="flex flex-col">
                        <label className="block text-md mb-2" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          onInvalid={showInvalidate}
                          onInput={hideInvalidate}
                          required
                        />
                      </div>
              
                      {/* Email */}
                      <div className="flex flex-col">
                        <label className="block text-md mb-2" htmlFor="email">
                          Email
                        </label>
                        <input
                          className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                          type="email"
                          name="email"
                          placeholder="Email"
                          onInvalid={showInvalidate}
                          onInput={hideInvalidate}
                          required
                        />
                      </div>
              
                      {/* Age */}
                      <div className="flex flex-col">
                        <label className="block text-md mb-2" htmlFor="age">
                          Age
                        </label>
                        <input
                          className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                          type="text"
                          name="age"
                          placeholder="Age"
                          onInvalid={showInvalidate}
                          onInput={hideInvalidate}
                          required
                        />
                      </div>
              
                      {/* Gender */}
                      <div className="flex flex-col">
                        <label className="block text-md mb-2" htmlFor="gender">
                          Gender
                        </label>
                        <select
                          name="gender"
                          className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                          defaultValue="select"
                          required
                        >
                          <option value="select" disabled>
                            Select Gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
              
                      {/* Phone Number */}
                      <div className="flex flex-col">
                        <label className="block text-md mb-2" htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                          type="text"
                          name="phone"
                          placeholder="Phone Number"
                          onInvalid={showInvalidate}
                          onInput={hideInvalidate}
                          required
                        />
                      </div>
              
                      {/* Address */}
                      <div className="flex flex-col">
                        <label className="block text-md mb-2" htmlFor="address">
                          Address
                        </label>
                        <input
                          className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                          type="text"
                          name="address"
                          placeholder="Address"
                          onInvalid={showInvalidate}
                          onInput={hideInvalidate}
                          required
                        />
                      </div>
                    </div>
                  </>
                  )}
                </div>
                <motion.span className='mx-auto text-red-500 text-center w-full block'>
                 {notice}
               </motion.span>
                <div className=''>
                  <button
                    type='submit'
                    className='mt-3 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100'
                  >
                    {isRegistering ? 'Sign up' : 'Login now'}
                  </button>
                </div>
              </form>
              <div className='flex flex-row mx-auto gap-1 mt-3 select-none'>
                <span className='text-gray-500 text-sm'>
                  {isRegistering
                    ? 'Already have an account?'
                    : "Don't have an account?"}
                </span>
                <span
                  className='text-red-500 text-sm underline cursor-pointer'
                  onClick={() => blueTextBottom(setNotice, setIsRegistering)}
                >
                  Sign {isRegistering ? 'in' : 'up'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
