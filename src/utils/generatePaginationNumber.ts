
// [1,2,3,4,...,7]
export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
    // si el total de páginas es 7 o menos se muestra todo sin ...
    if (totalPages <= 7)
        return Array.from({ length: totalPages }, (_, i) => i + 1)

    // Si la página actual esta entre las primeras tres páginas
    // mostrar las primeras 3 y las últimas 2
    if (currentPage <= 3)
        return [1, 2, 3, '...', totalPages - 1, totalPages]

    // Si la página esta entre las últimas páginas mostramos las primeras 2 y últimas 3
    if (currentPage >= totalPages - 2)
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]

    // Si la página actual esta en el medio
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}