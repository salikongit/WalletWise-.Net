import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

// Material UI Icons
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;



const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

 

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!EMAIL_REGEX.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authAPI.login(formData);

      // OTP flow unchanged
      localStorage.setItem('pendingUserId', response.data.userId);
      toast.success('OTP sent successfully');
      navigate('/verify-otp');
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12
      bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">

      <div className="
        w-full max-w-md p-8 sm:p-10
        rounded-3xl
        bg-white/40 backdrop-blur-xl
        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
        border border-white/30
      ">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to WalletWise
          </h2>
          <p className="text-base text-gray-700 mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <EmailOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="
                  w-full pl-11 pr-4 py-3 rounded-xl
                  bg-white/70 border border-gray-300
                  focus:ring-2 focus:ring-indigo-500
                  focus:outline-none text-gray-900
                "
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <LockOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="
                  w-full pl-11 pr-11 py-3 rounded-xl
                  bg-white/70 border border-gray-300
                  focus:ring-2 focus:ring-indigo-500
                  focus:outline-none text-gray-900
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword
                  ? <VisibilityOutlinedIcon />
                  : <VisibilityOffOutlinedIcon />}
              </button>
            </div>

          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold text-lg
              transition-all shadow-lg
              disabled:opacity-60
            "
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-base text-gray-700 mt-6">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-700 hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
