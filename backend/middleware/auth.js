import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const cookieToken = req.cookies?.access_token;
    const header = req.headers.authorization || '';
    const bearerToken =  header.startsWith('Bearer') ? header.split(' ')[1] : null;

    const token = cookieToken || bearerToken
    if(!token) return res.status(401).json({ sucess: false, message: "Token ausente"});
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (e) {
        console.error('Error verifying token:', e.message);
        return res.status(401).json({ success: false, message: "Token inválido" });
    }
}