import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { blueTextBottom, submitForm } from './login/functions';
import { hideInvalidate, showInvalidate } from './login/validation';
import LanguagePopover from '@components/dashboard/components/navBar/LanguagePopover';

const Login = () => {
  const { t } = useTranslation();

  const [isRegistering, setIsRegistering] = useState(false);

  const [notice, setNotice] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (document.cookie.includes('token='))
      navigate('/admin', { replace: true });
  }, [navigate]);

  return (
    <>
      <div className='min-h-screen'>
        {/* Phần ảnh nền giữ nguyên bên trái */}
        <div className='hidden md:block min-h-screen bg-cover bg-center fixed left-0 top-0 w-3/5'>
          <img
            src='https://cdn.pixabay.com/photo/2017/12/05/16/34/maple-2999706_1280.jpg'
            className='w-full h-full object-cover'
            alt='Background'
          />
        </div>

        {/* Phần form đăng nhập hoặc đăng ký */}
        <div className='flex justify-end relative'>
          <LanguagePopover />
          <div className='bg-red-50 min-h-screen w-2/5 flex justify-center items-center'>
            <div className=''>
              <form
                onSubmit={(e) =>
                  submitForm(
                    e,
                    isRegistering,
                    setNotice,
                    setIsRegistering,
                    navigate
                  )
                }
              >
                <div className='-mt-5'>
                  <span className='mx-auto select-none mb-2 '>
                    <h1 className='text-2xl font-bold '>
                      {isRegistering ? t('register.title') : t('login.title')}
                    </h1>
                  </span>
                </div>

                <div className='flex flex-col gap-2 mt-5'>
                  {/* Input Username */}
                  <div className='flex flex-col'>
                    <label
                      className='block text-md mb-0.5 ml-2'
                      htmlFor='username'
                    >
                      {t('login.username')}
                    </label>
                    <input
                      className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                      type='text'
                      name='username'
                      placeholder={t('login.username')}
                      onInvalid={showInvalidate}
                      onInput={hideInvalidate}
                      required
                    />
                  </div>

                  {/* Input Password */}
                  <div className='flex flex-col'>
                    <label
                      className='block text-md mb-0.5 ml-2'
                      htmlFor='password'
                    >
                      {t('login.password')}
                    </label>
                    <input
                      className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                      type='password'
                      name='password'
                      placeholder={t('login.password')}
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
                          {t('login.forgot')}
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='grid grid-cols-2 gap-2 max-w-full'>
                        {/* Full Name */}
                        <div className='flex flex-col col-span-2 '>
                          <label
                            className='block text-md mb-0.5 ml-2'
                            htmlFor='name'
                          >
                            {t('register.fullName')}
                          </label>
                          <input
                            className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                            type='text'
                            name='name'
                            placeholder={t('register.fullName')}
                            onInvalid={showInvalidate}
                            onInput={hideInvalidate}
                            required
                          />
                        </div>

                        {/* Email */}
                        <div className='flex flex-col col-span-2 '>
                          <label
                            className='block text-md mb-0.5 ml-2'
                            htmlFor='email'
                          >
                            {t('register.email')}
                          </label>
                          <input
                            className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                            type='email'
                            name='email'
                            placeholder={t('register.email')}
                            onInvalid={showInvalidate}
                            onInput={hideInvalidate}
                            required
                          />
                        </div>

                        {/* Address */}
                        <div className='flex flex-col col-span-2 '>
                          <label
                            className='block text-md mb-0.5 ml-2'
                            htmlFor='address'
                          >
                            {t('register.address')}
                          </label>
                          <input
                            className='p-2 w-full border-2 rounded-md text-sm outline-none'
                            type='text'
                            name='address'
                            placeholder={t('register.address')}
                            onInvalid={showInvalidate}
                            onInput={hideInvalidate}
                            required
                          />
                        </div>

                        {/* Age */}
                        <div className='flex flex-col'>
                          <label
                            className='block text-md mb-0.5 ml-2'
                            htmlFor='dateOfBirth'
                          >
                            {t('register.birth')}
                          </label>
                          <input
                            className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                            type='date'
                            name='dateOfBirth'
                            onInvalid={showInvalidate}
                            onInput={hideInvalidate}
                            required
                          />
                        </div>

                        {/* Gender */}
                        <div className='flex flex-col'>
                          <label
                            className='block text-md mb-0.5 ml-2'
                            htmlFor='gender'
                          >
                            {t('register.gender.label')}
                          </label>
                          <select
                            name='gender'
                            className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                            defaultValue='select'
                            required
                          >
                            <option value='select' disabled>
                              {t('register.gender.select')}
                            </option>
                            <option value='male'>
                              {t('register.gender.male')}
                            </option>
                            <option value='female'>
                              {t('register.gender.female')}
                            </option>
                          </select>
                        </div>

                        {/* Phone Number */}
                        <div className='flex flex-col col-span-2'>
                          <label
                            className='block text-md mb-0.5 ml-2'
                            htmlFor='phone'
                          >
                            {t('register.phoneNumber')}
                          </label>
                          <input
                            className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none'
                            type='text'
                            name='phone'
                            placeholder={t('register.phoneNumber')}
                            onInvalid={showInvalidate}
                            onInput={hideInvalidate}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <span className='mx-auto text-red-500 text-center w-full block'>
                  {notice}
                </span>
                <div className=''>
                  <button
                    type='submit'
                    className='mt-4 w-full bg-secondary hover:opacity-90 text-white py-2 rounded-full transition duration-100'
                  >
                    {isRegistering ? t('register.submit') : t('login.submit')}
                  </button>
                </div>
              </form>
              <div className='flex flex-row mx-auto gap-1 mt-1 select-none'>
                <span className='text-gray-500 text-sm'>
                  {isRegistering
                    ? t('register.loginText')
                    : t('login.registerText')}
                </span>
                <span
                  className='text-red-500 text-sm underline cursor-pointer'
                  onClick={() => blueTextBottom(setNotice, setIsRegistering)}
                >
                  {isRegistering ? t('register.login') : t('login.register')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
