import { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='container-auth'>
      <div className='auth-left'></div>
      <div className='auth-right'>
        <form className='auth-form'>
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
          <button className='auth-button'>Iniciar Sesión</button>
          <div className='auth-footer'>
            <span>¿Aún no tienes cuenta? </span>
            <Link href='/signup'>REGÍSTRATE</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
