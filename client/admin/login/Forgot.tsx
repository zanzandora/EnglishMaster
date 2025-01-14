import { motion } from 'framer-motion'

import { hideInvalidate, showInvalidate } from './login/valication'

const Forgot = () => {
  return (
    <div className='flex w-full h-full'>
      <motion.div
        className='flex flex-row m-auto bg-white shadow-xl rounded-xl h-[36rem]'
        layout
      >
        <motion.img src='/reg.jpg' className='rounded-l-xl' />
        <motion.div className='flex flex-col p-8 w-full h-full relative'>
          <motion.span layout='position' className='font-semibold text-4xl mx-auto select-none mb-2'>
            Forgot Password
          </motion.span>
          <div className='overflow-hidden h-full mt-4 text-lg'>
            <form className='flex flex-col py-4 h-full' method='post' action='/forgot'>
              <div className='flex flex-row gap-4 h-full'>
                <div className='flex flex-col gap-5'>
                  <input
                    type='text'
                    name='email'
                    placeholder='Email'
                    className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
                    onInvalid={showInvalidate}
                    onInput={hideInvalidate}
                    required
                  />
                </div>
              </div>

              <button
                type='submit'
                className='bg-sky-500 w-32 h-12 mx-auto py-2 px-5 rounded-lg text-white mt-2 cursor-pointer select-none'
              >
                Submit
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Forgot
