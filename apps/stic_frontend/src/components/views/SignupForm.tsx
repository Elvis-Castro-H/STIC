import { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); 
  };

  return (
    <div className='container-auth'>
      <div className='auth-left'></div>
      <div className='auth-right'>
        <form className='auth-form'>
          <h2 className='auth-title'>Registro</h2>
          <input
            className='auth-input'
            type='text'
            placeholder='Nombre de usuario'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
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
          <div className='checkbox'>
            <input
              type='checkbox'
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            />
            <label>Acepto los términos y condiciones</label>
          </div>
          <button className='auth-button' disabled={!accepted}>
            Registrarse
          </button>
          <div className='auth-footer'>
            <span>¿Ya tienes una cuenta? </span>
            <Link href='/login'>Inicia Sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
