import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const checkToken = (req: any, res: Response, next: NextFunction) => {
    let token: string = req.headers["authorization"] || "";

    if (token.startsWith("Bearer" )) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, "secret_key", (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    errors: [{
                        message: "No user found matching authentication token id"
                    }]
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            errors: [{
                message: "No user found matching authentication token id"
            }]
        });
    }
};

export default checkToken;