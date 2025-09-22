import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import '../style/cart.css'

type Product = {
  id: number;
  code: string;
  name: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
};

type RawCartItem = {
  id: number;
  productId: number;
  quantity: number;
  product?: Product;   // alguns ORMs devolvem 'product'
  Product?: Product;   // outros devolvem 'Product'
};

type CartItem = {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
};

export default function Cart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // ✅ CORREÇÃO: block body + return
  const normalize = (raw: RawCartItem): CartItem | null => {
    const prod = raw.product || raw.Product;
    if (!prod) return null;
    const price =
      typeof prod.price === "string" ? Number(prod.price) : (prod.price ?? 0);

    return {
      id: raw.id,
      productId: raw.productId,
      quantity: raw.quantity,
      product: { ...prod, price },
    };
  };

  const load = async () => {
    setMsg("");
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      const listRaw: RawCartItem[] = Array.isArray(data?.data) ? data.data : [];
      const list = listRaw
        .map(normalize)
        .filter((x): x is CartItem => !!x); // TS-friendly
      setItems(list);
    } catch (e: any) {
      console.error(e);
      setMsg(e?.response?.data?.message || "Erro ao carregar carrinho");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + it.quantity * Number(it.product.price || 0),
        0
      ),
    [items]
  );

  const updateQty = async (id: number, next: number) => {
    if (!Number.isFinite(next) || next < 1) return;
    const prev = items;
    // otimista
    setItems(prev.map((it) => (it.id === id ? { ...it, quantity: next } : it)));
    try {
      await api.put(`/cart/${id}`, { quantity: next });
    } catch (e: any) {
      console.error(e);
      setMsg(e?.response?.data?.message || "Erro ao atualizar quantidade");
      setItems(prev); // rollback
    }
  };

  const removeItem = async (id: number) => {
    const prev = items;
    // otimista
    setItems(prev.filter((it) => it.id !== id));
    try {
      await api.delete(`/cart/${id}`);
    } catch (e: any) {
      console.error(e);
      setMsg(e?.response?.data?.message || "Erro ao remover item");
      setItems(prev); // rollback
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Meu carrinho</h2>
        <p>Carregando carrinho...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Meu carrinho</h2>

      {msg && <p className="error" style={{ marginBottom: 12 }}>{msg}</p>}

      {items.length === 0 ? (
        <div className="empty">
          <p>Seu carrinho está vazio.</p>
          <Link to="/" className="primary">Ver produtos</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((it) => {
              const p = it.product;
              const subtotal = it.quantity * Number(p.price || 0);
              return (
                <div key={it.id} className="cart-item">
                  <div className="ci-thumb">
                    <img
                      src={p.imageUrl || "https://placehold.co/140x100?text=Sem+imagem"}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/140x100?text=Sem+imagem";
                      }}
                    />
                  </div>

                  <div className="ci-info">
                    <h4>{p.name}</h4>
                    <div className="muted">{p.code}</div>
                    {p.description && <p className="desc">{p.description}</p>}
                  </div>

                  <div className="ci-price">
                    <div>Preço</div>
                    <strong>R$ {Number(p.price).toFixed(2)}</strong>
                  </div>

                  <div className="ci-qty">
                    <div>Qtd.</div>
                    <div className="qty-controls">
                      <button
                        onClick={() => updateQty(it.id, it.quantity - 1)}
                        disabled={it.quantity <= 1}
                        aria-label="Diminuir quantidade"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (Number.isFinite(val) && val >= 1) {
                            updateQty(it.id, val);
                          }
                        }}
                      />
                      <button
                        onClick={() => updateQty(it.id, it.quantity + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="ci-sub">
                    <div>Subtotal</div>
                    <strong>R$ {subtotal.toFixed(2)}</strong>
                  </div>

                  <div className="ci-actions">
                    <button className="danger" onClick={() => removeItem(it.id)}>
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="cs-line">
              <span>Total</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
            <div className="cs-actions">
              <Link to="/" className="primary" style={{ textDecoration: 'none', fontWeight: '100' }}>Continuar comprando</Link>
              <button
                className="primary"
                onClick={() => alert("Checkout fora do escopo do desafio 😉")}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


