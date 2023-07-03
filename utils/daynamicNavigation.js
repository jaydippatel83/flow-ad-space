export function isChildrenPageActive(path, match) {
    if (path && match) {
        if (path === match) {
            return true;
        }
        return false;
    }
    return false;
} 
export function isParentPageActive(pages, path) {
    if (pages) {
        return pages.some((page) => page.path === path);
    }
    return false;
}
