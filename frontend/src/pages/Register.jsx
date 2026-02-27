// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { authAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorMessage from '../components/ErrorMessage';
// import SuccessMessage from '../components/SuccessMessage';
// import { Mail, Lock, User, Phone } from 'lucide-react';

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       await authAPI.register(formData);
//       setSuccess('Registration successful! Please login to continue.');
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create Your Account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Join WalletWise today
//           </p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <ErrorMessage message={error} onClose={() => setError('')} />
//           <SuccessMessage message={success} onClose={() => setSuccess('')} />
          
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                   First Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     required
//                     className="input-field pl-10"
//                     placeholder="John"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                   Last Name
//                 </label>
//                 <input
//                   id="lastName"
//                   name="lastName"
//                   type="text"
//                   required
//                   className="input-field"
//                   placeholder="Doe"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="input-field pl-10"
//                   placeholder="john@example.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone Number (Optional)
//               </label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   type="tel"
//                   className="input-field pl-10"
//                   placeholder="+1234567890"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   minLength="6"
//                   className="input-field pl-10"
//                   placeholder="Minimum 6 characters"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full btn-primary flex justify-center items-center"
//             >
//               {loading ? <LoadingSpinner size="sm" /> : 'Register'}
//             </button>
//           </div>

//           <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;



import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

// Material UI Icons
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });


    // Strength rules
  const getPasswordStrength = (password) => {
    if (!password) return { label: '', score: 0 };

    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*#?&]/.test(password)) score++;

    if (score <= 1) return { label: 'Weak', score: 1 };
    if (score === 2 || score === 3) return { label: 'Medium', score: 2 };
    return { label: 'Strong', score: 3 };
  };

  const strength = getPasswordStrength(formData.password);
  const [loading, setLoading] = useState(false);

  // ================= REGEX =================
  const nameRegex = /^[A-Za-z]{2,}$/;
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  const phoneRegex =
    /^\+?[1-9]\d{7,14}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    if (!nameRegex.test(formData.firstName)) {
      toast.warning('First name should contain only letters (min 2)');
      return false;
    }

    if (!nameRegex.test(formData.lastName)) {
      toast.warning('Last name should contain only letters (min 2)');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toast.warning('Please enter a valid email address');
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.warning(
        'Password must be 8+ chars with uppercase, lowercase, number & special character'
      );
      return false;
    }

    if (
      formData.phoneNumber &&
      !phoneRegex.test(formData.phoneNumber)
    ) {
      toast.warning('Enter a valid phone number with country code');
      return false;
    }

    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await authAPI.register(formData);
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 px-4">
      <div
        className="
          w-full max-w-md
          backdrop-blur-xl bg-white/60
          rounded-3xl
          shadow-[0_20px_50px_rgba(0,0,0,0.15)]
          border border-white/40
          p-8
        "
      >
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-600 mt-1">
          Join <span className="font-semibold text-indigo-600">WalletWise</span>
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <PersonOutlineOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                name="firstName"
                placeholder="First Name"
                className="w-full pl-10 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <input
              name="lastName"
              placeholder="Last Name"
              className="w-full py-3 px-4 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <EmailOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <PhoneIphoneOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              name="phoneNumber"
              placeholder="Phone"
              className="w-full pl-10 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <LockOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              name="password"
              type="password"
              placeholder="Strong Password"
              className="w-full pl-10 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />

            

          </div>
                      {/* 🔒 Strength Meter */}
            {strength.label && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Password strength</span>
                  <span
                    className={`font-semibold ${
                      strength.label === 'Weak'
                        ? 'text-red-600'
                        : strength.label === 'Medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {strength.label}
                  </span>
                </div>

                <div className="flex gap-1">
                  {[1, 2, 3].map(level => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded ${
                        strength.score >= level
                          ? strength.label === 'Weak'
                            ? 'bg-red-500'
                            : strength.label === 'Medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-indigo-600 text-white font-semibold
              hover:bg-indigo-700 transition
              shadow-lg
            "
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Register'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
