import { Request, Response } from "express";
import User from "../models/User";
import { loginValidation, registerValidation } from "../validations/userValidation";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import getPagination from "../helpers/getPagination";

export const login = async (req: Request, res: Response) => {
    const { email, password }: {email: string, password: string} = req.body;
    const errors: { message: string; }[] = [];

    // Validations
    const validationErrors: any = loginValidation(email, password);
    if (validationErrors.length>0)
        return res.status(400).json({errors: validationErrors});

    const user = await User.findOne({ email });
    // Check if user exist
    if (!user) {
        errors.push({
            message: "User doesn't exists"
        });
        return res.status(400).json({errors});
    }

    // Check if password correct
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
        errors.push({
            message: "Incorrect password"
        });
        return res.status(400).json({errors});
    }

    const token = jwt.sign({user}, "secret_key", {expiresIn: "24h"});
    return res.status(200).json({
        user,
        message: "Successfully logged in",
        accessToken: token
    });
};

export const createUser = async (req: Request, res: Response, isAuthPage=true) => {
    const { username, email, password }: {username: string, email: string, password: string} = req.body;
    const errors: { message: string; }[] = [];

    // Validations
    const validationErrors = registerValidation(username, email, password);
    if (validationErrors.length>0)
        return res.status(400).json({errors: validationErrors});

    // Check if user exist
    const userExists = await User.findOne({ email });
    if (userExists) {
        errors.push({
            message: "User already exists"
        });
        return res.status(400).json({errors});
    }

    // Crypte password for security
    const cryptedPassword = await bcryptjs.hash(password, 12);

    // Create user
    const createdUser = new User({
        username,
        email,
        password: cryptedPassword
    });
    createdUser.save()
        .then(() => {
            console.log("User successfuly created");
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({errors: [{
                message: "Something went wrong"
            }]});
        });

    if (isAuthPage) {
        const token = jwt.sign({createdUser}, "secret_key", {expiresIn: "24h"});
        res.json({
            user: createdUser,
            message: "User successfuly created",
            accessToken: token
        });
    }

    return res.status(200).json({
        user: createdUser,
        message: "User successfully created",
    });
};

export const getUsers = async (req: Request, res: Response) => {
    const { page, limit, sort }: any = req.query;

    if (!page && limit) {
        const users = await User.find({}).limit(limit);
        return res.status(200).json({
            items: users
        });
    }

    const { startAt } = getPagination(page, limit);

    if (page) {
        const usersCount = await User.countDocuments();
        const users = await User.find({}).sort({ createdAt: sort === "asc" ? 1 : -1 }).skip(startAt).limit(limit);
        return res.status(200).json({
            totalItemCount: usersCount,
            items: users,
            pagination: {
                count: Math.ceil(usersCount / limit),
                current: Number(page),
                hasNext: page < Math.ceil(usersCount / limit),
                next: Number(page)+1,
                hasPrev: page > 1,
                prev: Number(page)-1
            }
        });
    }

    const users = await User.find({});
    return res.status(200).json({
        items: users
    });
};