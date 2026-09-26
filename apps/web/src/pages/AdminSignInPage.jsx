import { useState } from "react";
import { useNavigate } from "react-router-dom";
import pb from "@/lib/pocketbaseClient.js";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function AdminSignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await pb.collection("admins").authWithPassword(email, password);
      navigate("/admin");
    } catch {
      setMessage("No fue posible iniciar sesión.");
    }
  };

  return <main className="mf-page"><div className="mf-container flex min-h-screen items-center justify-center"><form onSubmit={submit} className="mf-card w-full max-w-sm space-y-4 p-6"><h1 className="text-2xl font-black">Administración</h1><Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Correo" /><Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Contraseña" />{message && <p className="text-sm text-destructive">{message}</p>}<Button type="submit" className="w-full">Entrar</Button></form></div></main>;
}
