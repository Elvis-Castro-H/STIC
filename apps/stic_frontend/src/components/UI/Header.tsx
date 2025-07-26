"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import "../../styles/globals.css";
import Image from "next/image";
import logo from "@/assets/image/logo.jpg";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi"; // Importar iconos

export default function Header() {
  const { user, isAdmin, logout } = useFirebaseUser();

  return (
    <header className="header-container">
      <div className="header-left">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            className="logo"
            width={60}
            height={90}
          />
        </Link>
        <nav className="nav-links">
          <Link href="/productos" className="nav-item">
            COMPONENTES MECANICOS
          </Link>
          <Link href="/productos" className="nav-item">
            SEPARADORES DE ARO
          </Link>
          <Link href="/arma-tu-kit" className="nav-item">
            COTIZACIONES
          </Link>
        </nav>
      </div>

      <div className="header-right">
        {!user ? (
          <>
            <Link href="/login" className="login-link">
              Log In
            </Link>
            <Link href="/signup">
              <button className="signup-btn">Sign Up</button>
            </Link>
          </>
        ) : (
          <div className="user-info">
            
              <FaUser size={18} />
        
            <span className="user-name">{user.displayName || user.email}</span>
            
            {/* Enlace al Panel Admin - solo visible para administradores */}
            {isAdmin() && (
              <Link href="/adminpanel" className="admin-panel-link">
                <FiSettings size={18} />
                <span>Admin</span>
              </Link>
            )}
            
            <button onClick={logout} className="logout-btn">
              <FiLogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}