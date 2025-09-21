import { validationResult } from 'express-validator';
import { CartItem, Product } from '../models/index.js';

export const getCart = async ( req, res ) => {
    try {
        const items = await CartItem.findAll ({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });
        return res.json({ success: true, data: items})
    } catch (error) {   
        console.error(error)
        return res.status(500).json({ success: false, message: "Erro na consulta getCart"});
    }
};

export const addItem = async ( req, res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {return res.status(400).json({ success: false, errors: errors.array()[0].msg})}

        try {
            const { productId, quantity = 1} = req.body;
            const exists = await CartItem.findOne({
                where: { userId: req.user.id, productId }
            })
            if(exists) {
                exists.quantity += quantity;
                await exists.save();
                return res.json({ success: true, data: exists})
            }
            const item = await CartItem.create({ userId: req.user.id, productId, quantity })
            return res.status(201).json({ success: true, data: item})

        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, message: "Erro na consulta addItem"});
        }
}

export const updateItem = async (req, res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ success: false, errors: errors.array()[0].msg})
    }

    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const item = await CartItem. findOne({ where: { id, userId : req.user.id} })
        if (!item){
            return res.status(404).json({ success: false, message: "Item não encontratdo no carrinho"});
        }
        item.quantity = quantity;
        await item.save()
        return res.json({ success: true, data: item})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Erro na consulta updateItem"});  
    }
}

export const removeItem = async ( req, res ) => {
    try {
        const { id } = req.params
        const item = await CartItem.findOne({ where: { id, userId: req.user.id } })
        if (!item){
            return res.status(404).json({ success: false, message: "Item não encontrado no carrinho"});
        }
        await item.destroy()
        return res.json({ success: true, data: { id: Number(id)} });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Erro na consulta removeItem"});
    }
}


