export const getStatusMessage = (status) => {
    switch (status) {
        case "pending":
            return "Tồn kho";
        case "sold":
            return "Đã bán";
        case "done":
            return "Giao thành công";
        default:
            return "Tồn kho";
    }
};
