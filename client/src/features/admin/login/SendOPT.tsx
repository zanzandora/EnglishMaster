import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useForgotPassword from 'hooks/useForgotPassword';
import { hideInvalidate, showInvalidate } from './login/validation';
import { toast } from 'react-toastify';
import LanguagePopover from '@components/dashboard/components/navBar/LanguagePopover';
import { useTranslation } from 'react-i18next';

const ForgotPasswordOtp = () => {
  const { t } = useTranslation();

  const [otp, setOtp] = useState('');
  const { loading, verifyOtp } = useForgotPassword();
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {}; // Lấy email từ state (được chuyển từ ForgotPasswordEmail)

  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();
    const isOtpValid = await verifyOtp(email, otp);
    if (isOtpValid) {
      navigate('/reset-password', { state: { email, otp } });
    } else {
      toast.error('OTP không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <>
      <div className='min-h-'>
        {/* Phần ảnh nền giữ nguyên bên trái */}
        <div className='hidden md:block min-h-screen bg-cover bg-center fixed left-0 top-0 w-3/5'>
          <img
            src='https://cdn.pixabay.com/photo/2017/12/05/16/34/maple-2999706_1280.jpg'
            className='w-full h-full object-cover'
            alt='Background'
          />
        </div>

        {/* Phần form  */}
        <div className='flex justify-end'>
          <LanguagePopover />
          <div className='bg-red-50 min-h-screen w-2/5 flex justify-center items-center'>
            <form
              method='post'
              onSubmit={handleOtpSubmit}
              className='w-full max-w-sm'
            >
              <span className='font-semibold text-4xl mx-auto select-none mb-2 text-center'>
                <h1 className='text-2xl font-bold'>{t('verifyCode.title')}</h1>
              </span>

              <div className='flex flex-col gap-5 mt-5  '>
                <div className='flex flex-col mx-auto my-2'>
                  <input
                    className='px-4 w-72 border-2 py-2 rounded-md text-sm outline-none'
                    type='text'
                    value={otp}
                    placeholder='OTP'
                    onChange={(e) => setOtp(e.target.value)}
                    onInvalid={showInvalidate}
                    onInput={hideInvalidate}
                    required
                  />
                </div>
              </div>
              <div className=''>
                <p className='text-sm text-center'>
                  Please enter the 6-digits one time password (OTP) that we sent
                  to your registered email
                </p>
                <button
                  type='submit'
                  className='mt-3 mb-3 w-full bg-secondary hover:opacity-90 text-white py-2 rounded-full transition duration-100'
                >
                  {loading ? 'Cheking OTP...' : t('verifyCode.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordOtp;
