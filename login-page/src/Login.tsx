import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin-login`;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      const token = data.access_token;

      if (token) {
        localStorage.setItem('accessToken', token);
        console.log('Access token saved to localStorage');
      } else {
        console.warn('No token received from server - check API response format');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white font-sans antialiased">
      <div className="absolute top-6 left-6">
        <div className="flex flex-col items-start">
          <img src="/logo.jpg" alt="Finolex" className="h-12 w-auto" />
        </div>
      </div>

      <div className="w-full max-w-xs bg-white rounded shadow-lg p-6" style={{ boxShadow: '0 0 12px #d9d9d9' }}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700 text-xs mb-1 my-4.5">
              Email ID
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              autoComplete="username"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-left text-gray-700 text-xs mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-text"
              required
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="text-red-500 mb-3 text-sm text-left">{error}</div>}
          
          <div className="mt-5 flex justify-center">
            <button
              type="submit"
              className="w-1/2 my-3 text-white font-normal py-1 px-4 rounded transition-colors duration-200 disabled:opacity-70 cursor-pointer"
              style={{ backgroundColor: '#4dc3ff' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center px-4">
        <div className="flex items-center gap-2">
          <img src="/rewardify-logo.png" alt="Rewardify Logo" className="h-8 w-auto" />
          <span className="text-xs text-gray-500 cursor-default">
            Rewardify - Loyalty & Reward Management System A Solution by Karmaa Lab (
            <a 
              href="https://karmaalab.com" 
              className="underline text-gray-500 hover:text-blue-500"
              target="_blank" 
              rel="noopener noreferrer"
            >
              karmaalab.com
            </a>
            )
          </span>
        </div>
      </div>
    </div>
  );
}