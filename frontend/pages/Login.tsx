import { useState } from 'react'
import api from "../api/client"
import { useAuth } from '../hooks/useAuth'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  
  const from = (location.state as any)?.from || "/"
  const redirectTarget = typeof from === "string" && from !== "/login" ? from : "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg("")
    setLoading(true)
    try {
      const loginResp = await api.post("/auth/login", { email, password })
      setUser(loginResp.data?.data?.user ?? loginResp.data?.data ?? null)
      await new Promise((r) => setTimeout(r, 0)) // 1 tick para cookie HttpOnly

      const meResp = await api.get("/auth/me", { validateStatus: () => true })
      if (meResp.status !== 200) {
        setMsg(meResp?.data?.message || "Não foi possível confirmar sua sessão.")
        return
      }

      setUser(meResp.data?.data ?? null)
      nav(redirectTarget, { replace: true })
    } catch (e:any) {
      console.error(e)
      setMsg(e?.response?.data?.message || "Erro ao entrar")
    } finally {
      setLoading(false)
    }
  }

  return(
    <div className='page'>
      <h2>Entrar</h2>
      <form onSubmit={onSubmit} className='form'>
        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="username"
        />
        <input
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Senha"
          type="password"
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        {msg && <p className='msg error'>{msg}</p>}
      </form>
      <p>
        Não tem conta? <Link to="/register" state={{ from }}>Cadastre-se</Link>
      </p>
    </div>
  )
}