'use client'

import { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  fullname: string;
  email: string;
  password: string;
};

export default function SignupForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('Formulario enviado');
    console.log('Datos enviados:', data);

    setError('');
    setLoading(true);

    try {
      // 🔧 Simula el registro del usuario (ej. puedes enviar estos datos a una API)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simula retraso

      if (!accepted) {
        throw new Error('Debes aceptar los términos y condiciones');
      }

      // Aquí podrías redirigir o guardar el usuario en tu sistema
      console.log('Usuario registrado exitosamente');
    } catch (err: any) {
      setError(err.message || 'Hubo un error al crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-auth">
      <div className="auth-left"></div>
      <div className="auth-right">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <h2 className="auth-title">Registro</h2>

          {/* Nombre completo */}
          <input
            className="auth-input"
            type="text"
            placeholder="Nombre completo"
            {...register('fullname', { required: 'Este campo es obligatorio' })}
          />
          {errors.fullname && <span>{errors.fullname.message}</span>}

          {/* Email */}
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            {...register('email', { 
              required: 'Este campo es obligatorio',
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Por favor ingresa un email válido',
              },
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}

          {/* Contraseña */}
          <div className="password-container">
            <input
              className="auth-input"
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Contraseña"
              {...register('password', { required: 'Este campo es obligatorio' })}
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
          {errors.password && <span>{errors.password.message}</span>}

          {/* Aceptar términos y condiciones */}
          <div className="checkbox">
            <input
              type="checkbox"
              onChange={() => setAccepted(!accepted)}
            />
            <label>Acepto los términos y condiciones</label>
          </div>

          {/* Botón de registro */}
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>

          {/* Mensaje de error */}
          {error && <p className="error-message">{error}</p>}

          {/* Footer */}
          <div className="auth-footer">
            <span>¿Ya tienes una cuenta? </span>
            <Link href="/login">Inicia Sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
