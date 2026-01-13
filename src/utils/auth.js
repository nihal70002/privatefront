import {jwtDecode } from "jwt-decode";

export function getAuth() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      token,
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    };
  } catch {
    return null;
  }
}
