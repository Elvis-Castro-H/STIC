'use client'

import { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🔧 Aquí podrías hacer una petición a tu backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay

      if (!email || !password) {
        throw new Error('Todos los campos son obligatorios');
      }

      console.log('Usuario autenticado:', { email, password });
      // Redirigir o guardar estado de sesión aquí
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-auth'>
      <div className='auth-left'></div>
      <div className='auth-right'>
        <form className='auth-form' onSubmit={handleLogin}>
          <h2 className='auth-title'>Inicio de Sesión</h2>

          <input
            className='auth-input'
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div className="password-container">
            <input
              className='auth-input'
              type={passwordVisible ? 'text' : 'password'}
              placeholder='Contraseña'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label="Mostrar/Ocultar contraseña"
            >
              {passwordVisible ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className='auth-button' type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>

          <div className='auth-footer'>
            <span>¿Aún no tienes cuenta? </span>
            <Link href='/signup'>REGÍSTRATE</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
