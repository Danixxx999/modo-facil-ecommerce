import { Link } from "react-router-dom";
export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-muted/20"><header className="border-b bg-background"><div className="mf-container flex h-16 items-center justify-between"><Link to="/admin" className="font-black">Modo Fácil · Admin</Link><Link to="/" className="text-sm">Ver tienda</Link></div></header><main className="mf-container py-8">{children}</main></div>;
}
