"use client";

import { useAuth } from "@/lib/AuthProvider";

export default function AuthHeader() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="auth-header">
      <span className="auth-email">{user.email}</span>
      <button className="btn-small" onClick={signOut}>
        Cerrar sesión
      </button>
    </div>
  );
}
