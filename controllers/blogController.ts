import { Request, Response } from "express";
import slug from "slug";
import getPagination from "../helpers/getPagination";
import Blog from "../models/Blog";
import { createBlogValidation } from "../validations/blogValidation";


export const createBlog = async (req: Request, res: Response) => {
    const { 
        content,
        image,
        isActive,
        isCommentsActive,
        shortDescription,
        title
    } = req.body;

    // Validations
    const validationErrors: any = createBlogValidation(content, image, isActive, isCommentsActive, shortDescription, title);
    if (validationErrors.length>0)
        return res.status(400).json({errors: validationErrors});

    const blogLinkExists = await Blog.findOne({link: slug(title) });
    if (blogLinkExists) {
        return res.status(400).json({errors: [{
            message: "Blog name already in use"
        }]});
    }

    // Create blog
    const createdBlog = await new Blog({
        content,
        image,
        isActive,
        isCommentsActive,
        shortDescription,
        title,
        link: slug(title),
    });
    createdBlog.save();

    return res.status(200).json({
        items: createdBlog
    });
};

export const updateBlog = (req: Request, res: Response) => {
    const { content, image, isActive, isCommentsActive, shortDescription, title }: { content: string, image: string, isActive: boolean, isCommentsActive: boolean, shortDescription: string, title: string } = req.body;
    const id: string = req.params.id;

    if (!id) {
        return res.status(400).json({errors: [{
            message: "Please enter an id"
        }]});
    }

    Blog.findByIdAndUpdate(id, {
        content,
        image,
        isActive,
        isCommentsActive,
        shortDescription,
        title,
        link: title && slug(title)
    }, { new: true })
    .then((data) => {
        if (!data) {
            return res.status(404).send();
        }
        res.status(200).json(data);
    })
    .catch((err) => {
        res.status(400).json({
            errors: [{
                message: err.message
            }]
        });
    });
};

export const getBlogs = async (req: Request, res: Response) => {
    const { page, limit, sort }: any = req.query;

    if (!page && limit) {
        const blogs = await Blog.find({}).limit(limit);
        return res.status(200).json({
            items: blogs
        });
    }

    const { startAt } = getPagination(page, limit);
    
    if (page) {
        const blogsCount = await Blog.countDocuments();
        const blogs = await Blog.find({}).sort({ createdAt: sort === "asc" ? 1 : -1 }).skip(startAt).limit(limit);
        return res.status(200).json({
            totalItemCount: blogsCount,
            items: blogs,
            pagination: {
                count: Math.ceil(blogsCount / limit),
                current: Number(page),
                hasNext: page < Math.ceil(blogsCount / limit),
                next: Number(page)+1,
                hasPrev: page > 1,
                prev: Number(page)-1
            }
        });
    }

    const blogs = await Blog.find({});
    return res.status(200).json({
        items: blogs
    });
};

export const getBlog = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    if (!id) {
        return res.status(400).json({errors: [{
            message: "Please enter an id"
        }]});
    }

    Blog.findById(id)
        .then((data) => {
            if (data) {
                return res.status(200).json(data);
            } else {
                return res.status(400).json({errors: [{
                    message: "Something went wrong!"
                }]});
            }
        })
    
        .catch(err => {
            return res.status(400).json({errors: [
                err
            ]});
        });
    
};

export const deleteBlog = (req: Request, res: Response) => {
    const id: string = req.params.id;

    if (!id) {
        return res.status(400).json({errors: [{
            message: "Please enter an id"
        }]});
    }

    Blog.findByIdAndDelete(id)
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send({
            errors: err
        });
    });
};