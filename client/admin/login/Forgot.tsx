import { motion } from 'framer-motion';

import { hideInvalidate, showInvalidate } from './login/validation';

const Forgot = () => {
  return (
    // <div className='flex w-full h-full'>
    //   <motion.div className='flex flex-row m-auto bg-white shadow-xl rounded-xl h-[36rem]' layout>
    //     <motion.img src='/client/public/maple-leaf.jpg' className='rounded-l-xl' />
    //     <motion.div className='flex flex-col p-8 w-full h-full relative'>
    //       <motion.span layout='position' className='font-semibold text-4xl mx-auto select-none mb-2'>
    //         Forgot Password
    //       </motion.span>
    //       <div className='overflow-hidden h-full mt-4 text-lg'>
    //         <form className='flex flex-col py-4 h-full' method='post' action='/forgot'>
    //           <div className='flex flex-row gap-4 h-full'>
    //             <div className='flex flex-col gap-5'>
    //               <input
    //                 type='text'
    //                 name='email'
    //                 placeholder='Email'
    //                 className='bg-gray-200 px-3 h-12 w-72 rounded-lg outline-none border-2 border-transparent'
    //                 onInvalid={showInvalidate}
    //                 onInput={hideInvalidate}
    //                 required
    //               />
    //             </div>
    //           </div>

    //           <button type='submit' className='bg-sky-500 w-32 h-12 mx-auto py-2 px-5 rounded-lg text-white mt-2 cursor-pointer select-none'>
    //             Submit
    //           </button>
    //         </form>
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
            <form method='post' action='/forgot'>
              <motion.span
                layout='position'
                className='font-semibold text-4xl mx-auto select-none mb-2 text-center'
              >
                <h1 className='text-2xl font-bold'>Forgot Password</h1>
              </motion.span>

              <div className='flex flex-col gap-5 mt-5  '>
                <div className='flex flex-col'>
                  <label className='block text-md mb-2' htmlFor='email'>
                    Email
                  </label>
                  <input
                    className='px-4 w-72 border-2 py-2 rounded-md text-sm outline-none'
                    type='email'
                    name='email'
                    placeholder='Email'
                    onInvalid={showInvalidate}
                    onInput={hideInvalidate}
                    required
                  />
                </div>
              </div>
              <div className=''>
                <button
                  type='submit'
                  className='mt-3 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100'
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Forgot;
