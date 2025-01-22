import { useState } from 'react';
import { motion } from 'framer-motion';

import { blueTextBottom, submitForm } from './login/functions';
import { hideInvalidate, showInvalidate } from './login/validation';
import { Link } from 'react-router-dom';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [notice, setNotice] = useState('');

  return (
    // <div className='flex w-full h-full'>
    //   <motion.div
    //     className='flex flex-row m-auto bg-white shadow-xl rounded-xl h-[36rem]'
    //     layout
    //   >
    //     <motion.img
    //       src='/client/public/maple-leaf.jpg'
    //       className='rounded-l-xl object-cover w-[24rem] h-full'
    //       alt='Red maple leaf background'
    //     />
    //     <motion.div className='flex flex-col p-8 w-full h-full relative'>
    //       <motion.span
    //         layout='position'
    //         className='font-semibold text-4xl mx-auto select-none mb-2 text-red-600'
    //       >
    //         Sign {isRegistering ? 'Up' : 'In'}
    //       </motion.span>
    //       <div className='overflow-hidden h-full mt-4 text-lg'>
    //         <form
    //           className='flex flex-col py-4 h-full'
    //           onSubmit={(e) =>
    //             submitForm(e, isRegistering, setNotice, setIsRegistering)
    //           }
    //         >
    //           <div className='flex flex-row gap-4 h-full'>
    //             <div className='flex flex-col gap-5'>
    //               <input
    //                 type='text'
    //                 name='username'
    //                 placeholder='Username'
    //                 className='bg-red-100 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent focus:border-red-500'
    //                 onInvalid={showInvalidate}
    //                 onInput={hideInvalidate}
    //                 required
    //               />
    //               <input
    //                 type='password'
    //                 name='password'
    //                 placeholder='Password'
    //                 className='bg-red-100 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent focus:border-red-500'
    //                 onInvalid={showInvalidate}
    //                 onInput={hideInvalidate}
    //                 required
    //               />
    //               {!isRegistering ? (
    //                 <Link
    //                   to='/forgot'
    //                   className='text-sm text-end text-red-500 underline cursor-pointer select-none'
    //                 >
    //                   Forgot password?
    //                 </Link>
    //               ) : (
    //                 <>
    //                   <input
    //                     type='text'
    //                     name='name'
    //                     placeholder='Full Name'
    //                     className='bg-red-100 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent focus:border-red-500'
    //                     onInvalid={showInvalidate}
    //                     onInput={hideInvalidate}
    //                     required
    //                   />
    //                   <input
    //                     type='email'
    //                     name='email'
    //                     placeholder='Email'
    //                     className='bg-red-100 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent focus:border-red-500'
    //                     onInvalid={showInvalidate}
    //                     onInput={hideInvalidate}
    //                     required
    //                   />
    //                 </>
    //               )}
    //             </div>
    //             <div className='flex flex-col gap-5'>
    //               {isRegistering && (
    //                 <>
    //                   <input
    //                     type='text'
    //                     name='age'
    //                     placeholder='Age'
    //                     className='bg-red-100 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent focus:border-red-500'
    //                     onInvalid={showInvalidate}
    //                     onInput={hideInvalidate}
    //                     required
    //                   />
    //                   <select
    //                     name='gender'
    //                     className='bg-red-100 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent focus:border-red-500'
    //                     defaultValue='select'
    //                     required
    //                   >
    //                     <option value='select' disabled>
    //                       Select Gender
    //                     </option>
    //                     <option value='male'>Male</option>
    //                     <option value='female'>Female</option>
    //                   </select>
    //                   <input
    //                     type='text'
    //                     name='phone'
    //                     placeholder='Phone Number'
    //                     className='bg-red-100 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent focus:border-red-500'
    //                     onInvalid={showInvalidate}
    //                     onInput={hideInvalidate}
    //                     required
    //                   />
    //                   <input
    //                     type='text'
    //                     name='address'
    //                     placeholder='Address'
    //                     className='bg-red-100 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent focus:border-red-500'
    //                     onInvalid={showInvalidate}
    //                     onInput={hideInvalidate}
    //                     required
    //                   />
    //                 </>
    //               )}
    //             </div>
    //           </div>

    //           <motion.span className='mx-auto text-red-500'>
    //             {notice}
    //           </motion.span>

    //           <button
    //             type='submit'
    //             className='bg-red-500 w-32 h-12 mx-auto py-2 px-5 rounded-lg text-white mt-2 cursor-pointer select-none hover:bg-red-600'
    //           >
    //             Sign {isRegistering ? 'up' : 'in'}
    //           </button>
    //         </form>
    //       </div>
    //       <div className='mx-auto flex flex-col'>
    //         <div className='flex flex-row mx-auto gap-1 mt-3 select-none'>
    //           <span className='text-gray-500 text-sm'>
    //             {isRegistering
    //               ? 'Already have an account?'
    //               : "Don't have an account?"}
    //           </span>
    //           <span
    //             className='text-red-500 text-sm underline cursor-pointer'
    //             onClick={() => blueTextBottom(setNotice, setIsRegistering)}
    //           >
    //             Sign {isRegistering ? 'in' : 'up'}
    //           </span>
    //         </div>
    //       </div>
    //     </motion.div>
    //   </motion.div>
    // </div>
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
                <motion.span className='mx-auto text-red-500 text-center  block'>
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
