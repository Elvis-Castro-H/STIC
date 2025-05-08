"use client";

import Link from "next/link";
import { useState } from "react";
import "../../styles/globals.css";
import Image from "next/image";
import logo from "@/assets/image/logo.jpg";

interface User {
  name: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    setUser(null);
  };

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
            <span className="user-name">👤 {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
