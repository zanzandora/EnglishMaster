import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useForgotPassword from 'hooks/useForgotPassword';
import { toast } from 'react-toastify';
import LanguagePopover from '@components/dashboard/components/navBar/LanguagePopover';
import { useTranslation } from 'react-i18next';

const ForgotPasswordOtp = () => {
  const { t } = useTranslation();

  const [otp, setOtp] = useState(Array(6).fill(''));
  const { loading, verifyOtp } = useForgotPassword();
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const handleOtpChange = (e: any, index: number) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]$/.test(value)) {
      // Cập nhật giá trị của ô input và chuyển focus tới ô tiếp theo nếu cần
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5 && value !== '') {
        const nextInput = document.getElementById(`input${index + 1}`);
        nextInput?.focus(); // Chuyển focus tới ô tiếp theo
      }
    }
  };

  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();

    const otpString = otp.join(''); // Kết hợp mảng OTP thành chuỗi
    const isOtpValid = await verifyOtp(email, otpString); // Gửi OTP kiểm tra

    if (isOtpValid) {
      navigate('/reset-password', { state: { email, otp: otpString } });
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
              onSubmit={handleOtpSubmit}
              className='flex flex-col items-center justify-around w-72 rounded-xl p-5 '
            >
              <h2 className='text-2xl font-bold text-black'>
                {t('verifyCode.title')}
              </h2>
              <p className='text-gray-400 text-sm mt-1 text-center'>
                {t('verifyCode.message')}
              </p>

              <div className='flex mt-3 bg-white p-5 rounded-md'>
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`input${index}`}
                    value={value}
                    onChange={(e) => handleOtpChange(e, index)}
                    type='text'
                    maxLength={1}
                    className='w-8 h-8 text-center border-b-2 border-gray-300 mx-2 focus:border-blue-500 focus:outline-none'
                  />
                ))}
              </div>

              <button
                type='submit'
                className='mt-8 mb-3 w-full bg-secondary hover:opacity-90 text-white py-2 rounded-full transition duration-100'
              >
                {loading ? 'Checking OTP...' : t('verifyCode.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordOtp;
