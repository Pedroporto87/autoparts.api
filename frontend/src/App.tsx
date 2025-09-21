import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import Cart from "../pages/Cart";


function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Carregando...</div>;
  }
  return user ? children : <Navigate to="/login" />;
}

function Layout({ children }: { children: JSX.Element }) {
  const { user, logout } = useAuth()

  return (
    <div>
      <nav>
        <div className="nav-left">
          <Link to="/">AutoParts</Link>
          <Link to="/">Produtos</Link>
          <Link to="/cart">Carrinho</Link>
        </div>
        <div className="nav-right">
        {user ? (
            <>
              <span className="muted">{user.email}</span>
              <button onClick={logout}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Cadastrar</Link>
            </>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
          <Route path="/" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}