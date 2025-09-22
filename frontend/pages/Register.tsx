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
    const redirectTarget = typeof from === "string" && from !== "/register"
    ? from
    : "/";

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);
      
        try {
          // 1) cria conta
          await api.post("/auth/register", { name, email, password });
      
          // 2) auto-login (Set-Cookie: access_token)
          const loginResp = await api.post("/auth/login", { email, password });
          // (opcional) atualiza a UI com o user do login imediatamente
          setUser(loginResp.data?.data?.user ?? loginResp.data?.data ?? null);
      
          // 3) aguarda 1 "tick" para o cookie ficar disponível no próximo XHR
          await new Promise((r) => requestAnimationFrame(() => r(null)));
      
          // 4) confirma sessão com /auth/me (ESSENCIAL para suas permissões)
          const meResp = await api.get("/auth/me", {
            // evita que axios jogue erro automaticamente no 401/403
            validateStatus: (s) => s < 500,
          });
      
          if (meResp.status !== 200) {
            setMsg("Não foi possível confirmar sua sessão. Verifique se os cookies estão habilitados.");
            return; // não navega sem confirmar
          }
      
          // 5) popula o contexto com os dados “oficiais” do /me
          setUser(meResp.data?.data ?? null);
      
          // 6) navega para a lista de produtos
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
}


