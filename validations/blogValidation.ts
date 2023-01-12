export const createBlogValidation: any = (content: string, image: string, isActive: boolean, isCommentsActive: boolean, shortDescription: string, title: string) => {
    const errors = [];

    if (!content)
        errors.push({ message: "Please enter a content" });
    if (!image)
        errors.push({ message: "Please upload an image" });
    if (!isActive)
        errors.push({ message: "Please select blog status" });
    if (!isCommentsActive)
        errors.push({ message: "Please select comments status" });
    if (!shortDescription)
        errors.push({ message: "Please enter a short description" });
    if (!title)
        errors.push({ message: "Please enter a title" });

    return errors;
};
