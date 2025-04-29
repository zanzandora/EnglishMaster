import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useForgotPassword from 'hooks/useForgotPassword';
import { hideInvalidate, showInvalidate } from './login/validation';
import { toast } from 'react-toastify';
import LanguagePopover from '@components/dashboard/components/navBar/LanguagePopover';
import { useTranslation } from 'react-i18next';

const ForgotPasswordNewPassword = () => {
  const { t } = useTranslation();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { message, loading, resetPassword } = useForgotPassword();
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {}; // Lấy email và OTP từ state

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu không khớp. Vui lòng thử lại.');
      return;
    }
    resetPassword(email, otp, newPassword); // Xác thực OTP và thay đổi mật khẩu
    navigate('/login'); // Chuyển sang bước 3 với email và OTP
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
            <form method='post' onSubmit={handleSubmit}>
              <span className='font-semibold text-4xl mx-auto select-none mb-2 text-center'>
                <h1 className='text-2xl font-bold'>
                  {t('resetPassword.title')}
                </h1>
              </span>

              <div className='flex flex-col gap-5 mt-5  '>
                <div className='flex flex-col gap-4'>
                  <label className='block text-md mb-2' htmlFor='email'>
                    {t('resetPassword.newPassword')}
                  </label>
                  <input
                    className='px-4 w-72 border-2 py-2 rounded-md text-sm outline-none'
                    type='password'
                    value={newPassword}
                    placeholder='New Password'
                    onChange={(e) => setNewPassword(e.target.value)}
                    onInvalid={showInvalidate}
                    onInput={hideInvalidate}
                    required
                  />
                  <input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm New Password'
                    required
                    className='px-4 w-full border-2 py-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>
              <div className='mt-5 flex flex-col gap-4'>
                <button
                  type='submit'
                  className='mt-3 mb-3 w-full bg-secondary hover:opacity-90 text-white py-2 rounded-full transition duration-100'
                >
                  {loading ? 'Changing...' : t('resetPassword.submit')}
                </button>
              </div>
            </form>
            {message && toast.success(message)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordNewPassword;
