import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setToken, setUser } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

// MUI Icons
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const pendingUserId = localStorage.getItem('pendingUserId');
    if (!pendingUserId) {
      navigate('/login');
    } else {
      setUserId(parseInt(pendingUserId));
    }
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const updatedOtp = [...otp];
    pasted.split('').forEach((digit, i) => {
      if (i < 6) updatedOtp[i] = digit;
    });

    setOtp(updatedOtp);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const { data } = await authAPI.verifyOtp(userId, otpCode);

      setToken(data.token);

      const userData = {
        userId: data.userId,
        email: data.email,
        role: data.role,
        isOnboardingComplete: !data.onboardingRequired,
      };

      setUser(userData);
      localStorage.removeItem('pendingUserId');

      toast.success('OTP verified successfully');

      if (data.role === 'Admin') return navigate('/admin/dashboard');
      if (data.onboardingRequired) return navigate('/onboarding-wizard');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen flex items-center justify-center px-4 py-12
      bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100
    ">
      <div className="
        w-full max-w-md p-8 sm:p-10
        rounded-3xl
        bg-white/40 backdrop-blur-xl
        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
        border border-white/30
      ">
        {/* Header */}
        <div className="text-center mb-8">
          <ShieldOutlinedIcon className="mx-auto text-indigo-600" sx={{ fontSize: 48 }} />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Verify OTP
          </h2>
          <p className="text-base text-gray-700 mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* OTP Boxes */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="
                  w-12 h-14 sm:w-14 sm:h-16
                  text-2xl font-bold text-center
                  rounded-xl
                  bg-white/70 border border-gray-300
                  focus:ring-2 focus:ring-indigo-500
                  focus:outline-none
                  transition
                "
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="
              w-full py-3 rounded-xl
              bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold text-lg
              transition-all shadow-lg
              disabled:opacity-60
            "
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <LockOutlinedIcon />
                <span>Verify OTP</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
