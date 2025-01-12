import { useState } from 'react'
import { motion } from 'framer-motion'

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <div className='flex w-full h-full'>
      <motion.div
        className='flex flex-col m-auto gap-8 bg-white shadow-xl rounded-xl p-8'
        layout
      >
        <span
          className='font-semibold text-3xl mx-auto'
        >
          Đăng {isRegistering ? 'ký' : 'nhập'}
        </span>
        <motion.div
          layout
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
          className='overflow-hidden'
        >
          <form className='flex flex-col gap-4 py-4'>
            <motion.input
              layout
              type='email'
              id='email'
              placeholder='Email'
              className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none'
              required
            />
            <motion.input
              layout
              type='password'
              id='password'
              placeholder='Password'
              className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none'
              required
            />

            {isRegistering && (
              <>
                <motion.input
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: '3rem', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  type='password'
                  id='confirm-password'
                  placeholder='Confirm Password'
                  className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none'
                  required
                />
                <motion.input
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: '3rem', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  type='text'
                  id='extra-field'
                  placeholder='Extra Field'
                  className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none'
                  required
                />
              </>
            )}

            <motion.button
              layout
              type='submit'
              className='bg-sky-500 w-32 h-12 mx-auto py-2 px-5 rounded-lg text-white mt-2'
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 10px rgba(0, 162, 255, 0.7)', // Adds the glowing effect
              }}
              whileTap={{ scale: 0.9 }}
            >
              Đăng {isRegistering ? 'ký' : 'nhập'}
            </motion.button>
          </form>
        </motion.div>
        <div className='flex flex-row mx-auto gap-1 mt-3 select-none'>
          <span className='text-gray-500 text-sm'>
            {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          </span>
          <span
            className='text-sky-500 text-sm underline cursor-pointer'
            onClick={() => setIsRegistering((state) => !state)}
          >
            Đăng {isRegistering ? 'nhập' : 'ký'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
