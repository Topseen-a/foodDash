import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function StaffRegisterPage() {
    const { registerStaff } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', staffCode: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await registerStaff(form.name, form.email, form.password, form.staffCode);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Staff Registration</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
            <input placeholder='Full Name' value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className='w-full border rounded-lg px-4 py-2' required/>
            <input type='email' placeholder='Email' value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} className='w-full border rounded-lg px-4 py-2' required/>
            <input type='password' placeholder='Password (min 8 chars)' value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} className='w-full border rounded-lg px-4 py-2' required/>
            <input type='password' placeholder='Staff Code' value={form.staffCode} onChange={e=>setForm(p=>({...p,staffCode:e.target.value}))} className='w-full border rounded-lg px-4 py-2' required/>
            {error &&
            <p className='text-red-500 text-sm'>{error}</p>
            } <button type='submit' disabled={loading} className='w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50'>
            {loading? 'Registering...':'Create Staff Account'} </button>
        </form>
        <p className='text-center mt-4 text-sm'>Have an account?<Link to='/login' className='text-orange-500'>Login</Link>
        </p>
        </div>
    );
}
