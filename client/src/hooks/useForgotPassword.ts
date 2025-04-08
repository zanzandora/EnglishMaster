import { useState } from 'react';
import { toast } from 'react-toastify';

const useForgotPassword = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Gửi OTP qua email
  const sendOtp = async (email: any) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      toast.error('Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

   // Xác thực OTP
   const verifyOtp = async (email, otp) => {
    setLoading(true);

    try {
      const response = await fetch('/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message); // Hiển thị thông báo thành công
        return true; // OTP hợp lệ
      } else {
        toast.error(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        return false; // OTP không hợp lệ
      }
    } catch (error) {
      toast.error('Không thể xác thực OTP. Vui lòng thử lại.');
      return false; // OTP không hợp lệ
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP và thay đổi mật khẩu
  const resetPassword = async (email, otp, newPassword) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      setMessage('Không thể thay đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return {
    message,
    loading,
    sendOtp,
    resetPassword,
    verifyOtp,
  };
};

export default useForgotPassword;
