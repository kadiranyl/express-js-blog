import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    isCommentsActive: {
        type: Boolean,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },

}, {
    "timestamps": true
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;