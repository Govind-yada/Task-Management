import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiZap } from 'react-icons/fi';

//  Defined OUTSIDE Register so it doesn't re-create on every keystroke
const Field = ({ label, icon: Icon, type = 'text', placeholder, field, error, extra, form, setForm, errors, setErrors, showPass, setShowPass }) => (
  <div>
    <label className="label">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input
        type={type}
        placeholder={placeholder}
        className={`input-field pl-9 ${extra || ''} ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
        value={form[field]}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, [field]: e.target.value }));
          setErrors((prev) => ({ ...prev, [field]: '' }));
        }}
      />
      {field === 'password' && (
        <button
          type="button"
          onClick={() => setShowPass((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  // Shared props passed down to Field
  const fieldProps = { form, setForm, errors, setErrors, showPass, setShowPass };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 to-brand-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <FiZap className="text-white w-5 h-5" />
            </div>
            <span className="text-white font-bold text-xl">TaskFlow</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Start organizing<br />your work today.
          </h1>
          <p className="text-brand-200 text-lg">Free forever. No credit card needed.</p>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <p className="text-white/90 text-sm italic leading-relaxed">
            "TaskFlow transformed how our team ships features. We cut missed deadlines by 60%."
          </p>
          <p className="text-brand-200 text-xs mt-3 font-medium">— Engineering Lead at a fast-growing startup</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <FiZap className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">TaskFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Start managing your tasks for free</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Full Name" icon={FiUser} placeholder="John Doe" field="name" error={errors.name} {...fieldProps} />
            <Field label="Email" icon={FiMail} type="email" placeholder="you@example.com" field="email" error={errors.email} {...fieldProps} />
            <Field label="Password" icon={FiLock} type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" field="password" error={errors.password} extra="pr-10" {...fieldProps} />

            {/* Confirm Password — inline since it has no show/hide toggle variant */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Repeat password"
                  className={`input-field pl-9 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-2.5 mt-1">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
