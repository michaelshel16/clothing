import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase.js';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { setLogin } from '../state/States.jsx';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // Optional: install lucide-react for icons

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const loggedInUser                    = useSelector(state=>state.user)
  console.log(loggedInUser)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Optional: Send to your backend if needed
      const response = await axios.post('http://localhost:3000/clothing/v1/login', { idToken });

      const backendUser = response.data.user;

      dispatch(setLogin({
        token: idToken,
        user: backendUser,
      }));

      navigate('/'); // or wherever you want after login
    } catch (err) {
      console.error(err);
      setError(
        err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
          ? 'Invalid email or password'
          : 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
  e.preventDefault()
  const provider = new GoogleAuthProvider();
  setLoading(true);
  setError('');

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const idToken = await user.getIdToken();
    console.log(user,idToken)
    const response = await axios.post('http://localhost:3000/clothing/v1/googlelogin', 
      
      { idToken:idToken });

    const backendUser = response.data.user;

    console.log(backendUser)

    dispatch(setLogin({
      token: idToken,
      user: backendUser,
    }));

    alert(backendUser.isNewUser ? 'Welcome! Account created.' : 'Welcome back!');
    navigate('/');
  } catch (err) {
    console.error('Google login error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      setError(''); // Silent – user closed popup
    } else {
      setError('Google login failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded-lg p-4 bg-gray-50 border border-gray-300 text-gray-900 
                       placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent transition-all"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="rounded-lg p-4 bg-gray-50 border border-gray-300 text-gray-900 
                         placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg p-4 bg-blue-600 text-white font-semibold 
                       transition-all duration-300
                       ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 active:scale-95'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-white px-4 text-sm text-gray-500">or</span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`rounded-lg p-4 bg-white border-2 border-gray-300 text-gray-800 font-semibold 
                     flex items-center justify-center gap-3 transition-all duration-300
                     ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 active:scale-95'}`}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          Login with Google
        </button>

        <div className="text-center text-sm text-gray-600 mt-4">
          <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
          <span className="mx-2">•</span>
          <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;