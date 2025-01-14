import { useState } from 'react'
import { motion } from 'framer-motion'

import { blueTextBottom, submitForm } from './login/functions'
import { hideInvalidate, showInvalidate } from './login/validation'
import { Link } from 'react-router-dom'

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false)

  const [notice, setNotice] = useState('')

  return (
    <div className='flex w-full h-full'>
      <motion.div
        className='flex flex-row m-auto bg-white shadow-xl rounded-xl h-[36rem]'
        layout
      >
        <motion.img src='/reg.jpg' className='rounded-l-xl' />
        <motion.div className='flex flex-col p-8 w-full h-full relative'>
          <motion.span layout='position' className='font-semibold text-4xl mx-auto select-none mb-2'>
            Sign {isRegistering ? 'Up' : 'In'}
          </motion.span>
          <div className='overflow-hidden h-full mt-4 text-lg'>
            <form className='flex flex-col py-4 h-full' onSubmit={e => submitForm(e, isRegistering, setNotice, setIsRegistering)}>
              <div className='flex flex-row gap-4 h-full'>
                <div className='flex flex-col gap-5'>
                  <input
                    type='text'
                    name='username'
                    placeholder='Username'
                    className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                    onInvalid={showInvalidate}
                    onInput={hideInvalidate}
                    required
                  />
                  <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                    onInvalid={showInvalidate}
                    onInput={hideInvalidate}
                    required
                  />
                  {!isRegistering
                    ? <Link to='/forgot' className='text-sm text-end text-blue-500 underline cursor-pointer select-none'>
                      Forgot password?
                    </Link>
                    : <>
                      <input
                        type='text'
                        name='name'
                        placeholder='Full Name'
                        className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                        onInvalid={showInvalidate}
                        onInput={hideInvalidate}
                        required
                      />
                      <input
                        type='text'
                        name='email'
                        placeholder='Email'
                        className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                        onInvalid={showInvalidate}
                        onInput={hideInvalidate}
                        required
                      />
                    </>
                  }
                </div>
                <div className='flex flex-col gap-5'>
                  {isRegistering && (
                    <>
                      <input
                        type='text'
                        name='age'
                        placeholder='Age'
                        className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                        onInvalid={showInvalidate}
                        onInput={hideInvalidate}
                        required
                      />
                      <select
                        name='gender'
                        className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                        defaultValue='select'
                        required
                      >
                        <option value='select' disabled>Select Gender</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                      </select>
                      <input
                        type='text'
                        name='phone'
                        placeholder='Phone Number'
                        className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                        onInvalid={showInvalidate}
                        onInput={hideInvalidate}
                        required
                      />
                      <input
                        type='text'
                        name='address'
                        placeholder='Address'
                        className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                        onInvalid={showInvalidate}
                        onInput={hideInvalidate}
                        required
                      />
                    </>
                  )}
                </div>
              </div>

              <motion.span className='mx-auto text-red-500'>{notice}</motion.span>

              <button
                type='submit'
                className='bg-sky-500 w-32 h-12 mx-auto py-2 px-5 rounded-lg text-white mt-2 cursor-pointer select-none'
              >
                Sign {isRegistering ? 'up' : 'in'}
              </button>
            </form>
          </div>
          <div className='mx-auto flex flex-col'>
            <div className='flex flex-row mx-auto gap-1 mt-3 select-none'>
              <span className='text-gray-500 text-sm'>
                {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'}
              </span>
              <span
                className='text-sky-500 text-sm underline cursor-pointer'
                onClick={() => blueTextBottom(setNotice, setIsRegistering)}
              >
                Sign {isRegistering ? 'in' : 'up'}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
