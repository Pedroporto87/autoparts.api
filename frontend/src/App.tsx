import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import AuthProvider from "../contexts/AuthContext"; 
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";
import Register from "../pages/Register";           
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import "./index.css";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page">Carregando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }: { children: JSX.Element }) {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className="nav">
        <div className="left">
          <Link to="/" className="brand">AutoParts</Link>
          <Link to="/" className="brand-bottons">Produtos</Link>
          <Link to="/cart" className="brand-bottons">Carrinho</Link>
        </div>
        <div className="right">
          {user ? (
            <>
              <span className="muted">Bem vindo, {user.name}</span>
              <button className="primary" onClick={logout}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="brand-bottons">Entrar</Link>
              <Link to="/register" className="brand-bottons">Cadastrar</Link>
            </>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
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
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
