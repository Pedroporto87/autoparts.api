import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token =  header.startsWith('Bearer') ? header.split(' ')[1] : null;
    if(!token) return res.status(401).json({ sucess: false, message: "Token ausente"});
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (e) {
        console.error('Error verifying token:', e.message); // Log the error for debugging
        return res.status(401).json({ success: false, message: "Token inválido" });
    }
}