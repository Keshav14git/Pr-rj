import jwt from 'jsonwebtoken';

export const protectAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        if ((decoded as any).role === 'admin') {
            return next();
        } else {
            return res.status(401).json({ success: false, message: 'Not authorized as admin' });
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
