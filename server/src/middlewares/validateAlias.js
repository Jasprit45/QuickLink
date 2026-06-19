export const validateAlias = async(req, resizeBy, next) => {
    const  { customAlias} = req.body;
    const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;

    if (customAlias && !aliasRegex.test(customAlias)) {
        return res.status(400).json({
            success: false,
            message: "Invalid alias. Only letters, numbers, underscores (_) and hyphens (-) are allowed."
        });
    }
    next();
}