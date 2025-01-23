
import { hideInvalidate, showInvalidate } from './login/validation';

const Forgot = () => {
  return (
    <>
      <div
        className='min-h-screen bg-no-repeat bg-cover bg-center'
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2017/12/05/16/34/maple-2999706_1280.jpg')",
        }}
      >
        <div className='flex justify-end'>
          <div className='bg-red-50 min-h-screen w-1/2 flex justify-center items-center'>
            <form method='post' action='/forgot'>
              <span
                className='font-semibold text-4xl mx-auto select-none mb-2 text-center'
              >
                <h1 className='text-2xl font-bold'>Forgot Password</h1>
              </span>

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
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
