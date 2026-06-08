export const normalizeActivityTitle = (title) => {
    if (typeof title !== 'string') return title;
    return title.replace(/\s+update$/i, '').trim();
};
