import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../hooks/useAuth'
import "../src/index.css"

type Product = {
    id: number;
    code: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
}

export default function Products() {
    const [items, setItems] = useState<Product[]>([])
    const [q, setQ] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { user } = useAuth()
    const [msg, setMsg] = useState("")

    const PAGE_SIZE = 8;

    const load = async () => {
        try {
          setMsg("");
          const { data } = await api.get("/products", { params: { page, limit: PAGE_SIZE } });;
          console.log("GET /products payload:", data);
          setItems(Array.isArray(data.date) ? data.date : []);
          setTotalPages(data?.meta?.totalPages ?? 1);

        } catch (e:any) {
          console.error(e);
          setMsg(e?.response?.data?.message || "Erro ao carregar produtos");
          setItems([]);
          setTotalPages(1);
        }
      };

      const search = async () => {
        try {
          setMsg("");
          if (!q.trim()) return load();
          const { data } = await api.get(`/products/search?q=${encodeURIComponent(q)}`);
          setItems(Array.isArray(data.data) ? data.data : []);
          setTotalPages(1); setPage(1);
        } catch (e:any) {
          console.error(e);
          setMsg(e?.response?.data?.message || "Erro na busca");
          setItems([]);
          setTotalPages(1);
        }
      };

    const addToCart = async (productId: number) => {
        if (!user) { alert("Faça login para adicionar ao carrinho"); return; }
        try {
            await api.post("/cart", { productId, quantity: 1 })
            alert("Produto adicionado ao carrinho")
        } catch (error: any) {
            alert(error?.response?.data?.message || "Erro ao adicionar ao carrinho")
        }
    };

    useEffect(() => { load(); }, []);   // ← roda 1x
    useEffect(() => { load(); }, [page]);


  return (
    <div className="page">
      <h2>Produtos</h2>
      <div className="searchbar">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome ou código" />
        <button onClick={search}>Buscar</button>
      </div>

      <div className="grid">
        {items.map(p => (
          <div key={p.id} className="card">
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="thumb" />}
            <h4>{p.name}</h4>
            <small className="muted">{p.code}</small>
            <p className="desc">{p.description}</p>
            <strong>R$ {Number(p.price).toFixed(2)}</strong>
            <button onClick={() => addToCart(p.id)} className="primary">Adicionar</button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pager">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Próxima</button>
        </div>
      )}
    </div>
  );
}

