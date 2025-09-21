import { Product } from '../models/index.js'
import { Op } from 'sequelize';

export const getProducts = async ( req, res ) => {
    try {
        const page = parseInt(req.query.page || "1", 10)
        const limit = parseInt(req.query.limit || "10", 10)
        const offset = (page - 1) * limit

        const { rows, count } = await Product.findAndCountAll({
            limit, offset, order: [["id", "ASC"]]
        });

        return res.json({
            success: true,
            date: rows,
            meta: { page, limit, total: count, totalPages: Math.ceil(count/limit) },
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Erro no consulta getProducts" });
    }
}


// GET /api/products/search?q=termo
export const getProductsById = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ success: true, data: [] });

    const results = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },         // SQLite: use Op.like
          { code: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      order: [["name", "ASC"]],
    });

    return res.json({ success: true, data: results });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Erro na busca" });
  }
};


export const addProduct = async (req, res) => {
    try {
      const { code, name, price, description = "", imageUrl = "" } = req.body;
  
      if (!code || !name || price == null) {
        return res.status(400).json({
          success: false,
          message: "Campos obrigatórios: code, name, price",
        });
      }

      const exists = await Product.findOne({ where: { code } });
      if (exists) {
        return res.status(400).json({ success: false, message: "Código já cadastrado" });
      }
  
      const product = await Product.create({ code, name, price, description, imageUrl });
      return res.status(201).json({ success: true, data: product });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, message: "Erro no servidor" });
    }
  };