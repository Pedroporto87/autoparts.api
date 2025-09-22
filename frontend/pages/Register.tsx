import { useState } from 'react'
import api from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, Link, useLocation } from 'react-router-dom'
export default function Register(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const { setUser } = useAuth()
    const nav = useNavigate()
    const location = useLocation()
    const from = (location.state as any)?.from || "/"
    // const redirectTarget = typeof from === "string" && from !== "/register"
    // ? from
    // : "/";

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMsg("");
      setLoading(true);
    
      try {
        await api.post("/auth/register", { name, email, password });
    
        const loginResp = await api.post("/auth/login", { email, password });
        setUser(loginResp.data?.data?.user ?? loginResp.data?.data ?? null);
    
        await new Promise((r) => setTimeout(r, 0)); // 1 tick para cookie HttpOnly
    
        const meResp = await api.get("/auth/me", { validateStatus: () => true });
        if (meResp.status !== 200) {
          setMsg(meResp?.data?.message || "Não foi possível confirmar sua sessão.");
          return;
        }
    
        setUser(meResp.data?.data ?? null);
        nav("/", { replace: true });
      } catch (e: any) {
        setMsg(e?.response?.data?.message || "Erro ao cadastrar");
      } finally {
        setLoading(false);
      }
    };
    

  return (
    <div className="page">
    <h2>Criar conta</h2>
    <form onSubmit={onSubmit} className="form">
      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        placeholder="Nome"
        autoComplete="name"
      />
      <input
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
      />
      <input
        value={password}
        onChange={e=>setPassword(e.target.value)}
        type="password"
        placeholder="Senha"
        autoComplete="new-password"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Criando conta..." : "Cadastrar"}
      </button>
    </form>
    {msg && <p className="error">{msg}</p>}
    <p>Já tem conta? <Link to="/login" state={{ from }}>Entrar</Link></p>
  </div>
  )
};


