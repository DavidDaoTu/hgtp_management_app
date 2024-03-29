const profileInputs = [
    {
        id: 1,
        name: "name",
        type: "text",
        label: "Name",
        placeholder: "Name",
    },
    {
        id: 2,
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "Email",
    },
    {
        id: 3,
        name: "phone",
        type: "text",
        label: "Phone",
        placeholder: "Phone",
    },
    {
        id: 4,
        name: "birthday",
        type: "date",
        label: "Birthday",
    },
];

const passwordInputs = [
    {
        id: 1,
        name: "oldPassword",
        type: "password",
        // label: "Current Password",
        label: "Mật khẩu hiện tại",
        required: true,
    },
    {
        id: 2,
        name: "newPassword",
        type: "password",
        // label: "New Password",
        label: "Mật khẩu mới",
        required: true,
    },
    {
        id: 3,
        name: "rePassword",
        type: "password",
        // label: "Enter New Password",
        label: "Nhập lại mật khẩu mới",
        required: true,
    },
];

const categoryInputs = [
    {
        id: 1,
        name: "title",
        // label: "Title",
        // placeholder: "Title",
        label: "Tên loại gỗ",
        placeholder: "Tên loại gỗ",
        type: "text",
        required: true,
    },
    {
        id: 2,
        name: "desc",
        // label: "Description",
        // placeholder: "Description",
        label: "Mô tả",
        placeholder: "Mô tả",
        type: "text",
    },
];

const productInputs = [
    {
        id: 1,
        name: "productId",
        // label: "Product ID",
        // placeholder: "Product ID",
        label: "Mã Cont",
        placeholder: "Mã Cont",
        type: "text",
        required: true,
        display: 'show'
    },
    {
        id: 2,
        name: "categoryId",
        // label: "Category",
        // placeholder: "Category",
        label: "Loại Hàng",
        placeholder: "Loại Hàng",
        type: "select",
        required: true,
        display: 'show'
    },
    {
        id: 3,
        name: "price",
        // label: "Price",
        // placeholder: "Price",
        label: "Giá 1 Tấn (Triệu VNĐ)",
        placeholder: "Giá 1 Tấn",
        type: "text",
        required: true,
        display: 'hide'
    },
    {
        id: 4,
        name: "deposit",
        // label: "Deposit",
        // placeholder: "Deposit",
        label: "Tiền Đặt Cọc (Triệu VNĐ)",
        placeholder: "Cọc",
        type: "text",
        required: true,
        display: 'hide'
    },
    {
        id: 5,
        name: "amount",
        // label: "Amount",
        // placeholder: "Amount",
        label: "Tổng tiền thu về (VNĐ)",
        placeholder: "Tổng tiền thu về (VNĐ)",
        type: "text",
        display: 'hide'
    },
    {
        id: 6,
        name: "saleDate",
        // label: "Sale date",
        // placeholder: "Sale date",
        label: "Ngày bán",
        placeholder: "Ngày bán",
        type: "date",
        display: 'hide'
    },
    {
        id: 7,
        name: "arrivalDate",
        // label: "Arrival date",
        // placeholder: "Arrival date",
        label: "Ngày hàng về",
        placeholder: "Ngày hàng về",
        type: "date",
        display: 'hide'
    },
    {
        id: 8,
        name: "deliveryDate",
        // label: "Delivery date",
        // placeholder: "Delivery date",
        label: "Ngày giao hàng",
        placeholder: "Ngày giao hàng",
        type: "date",
        display: 'hide'
    },
    {
        id: 9,
        name: "port",
        // label: "Port",
        // placeholder: "Port",
        label: "Cảng",
        placeholder: "Cảng",
        type: "text",
        display: 'hide'
    },
    {
        id: 10,
        name: "document",
        // label: "Document",
        // placeholder: "Document",
        label: "Bill",
        placeholder: "Bill",
        type: "text",
        display: 'hide'
    },
    {
        id: 11,
        name: "customerId",
        // label: "Customer",
        // placeholder: "Customer",
        label: "Khách hàng",
        placeholder: "Khách hàng",
        type: "select",
        required: true,
        display: 'hide'
    },
    {
        id: 12,
        name: "sellerId",
        // label: "Seller",
        // placeholder: "Seller",
        label: "Người bán",
        placeholder: "Người bán",
        type: "select",
        required: true,
        display: 'hide'
    },
    {
        id: 13,
        name: "desc",
        // label: "Description",
        // placeholder: "Description",
        label: "Ghi chú",
        placeholder: "Ghi chú",
        type: "text",
        display: 'show'
    },
    {
        id: 14,
        name: "status",
        // label: "Status",
        // placeholder: "Status",
        label: "Trạng thái",
        placeholder: "Trạng thái",
        type: "select",
        required: true,
        options: [
            { value: "pending", title: "Tồn kho" },
            { value: "sold", title: "Đã bán" },
            // { value: "done", title: "Giao thành công" },
        ],
        display: 'show'
    },
];

const productInputsAdmin = [
    {
        id: 1,
        name: "amount",
        // label: "Amount",
        // placeholder: "Amount",
        label: "Tổng tiền thu về (VNĐ)",
        placeholder: "Tổng tiền thu về (VNĐ)",
        type: "text",
    },
    {
        id: 2,
        name: "payment",
        // label: "Payment",
        // placeholder: "Payment",
        label: "Tổng tiền đã thanh toán (VNĐ)",
        placeholder: "Tổng tiền đã thanh toán (VNĐ)",
        type: "text",
    },
];

const customerInputs = [
    {
        id: 1,
        name: "name",
        // label: "Name",
        // placeholder: "Name",
        label: "Tên KH",
        placeholder: "Tên KH",
        type: "text",
    },
    {
        id: 2,
        name: "phone",
        // label: "Phone",
        // placeholder: "Phone",
        label: "SĐT",
        placeholder: "SĐT",
        type: "text",
        required: true,
    },
    {
        id: 3,
        name: "email",
        // label: "Email",
        // placeholder: "Email",
        label: "Email",
        placeholder: "Email",
        type: "email",
    },
    {
        id: 4,
        name: "birthday",
        // label: "Birthday",
        // placeholder: "Birthday",
        label: "Birthday",
        placeholder: "Birthday",
        type: "date",
    },
    {
        id: 5,
        name: "company",
        // label: "Company",
        // placeholder: "Company",
        label: "Công ty",
        placeholder: "Công ty",
        type: "text",
    },
    {
        id: 6,
        name: "bankAccount",
        // label: "Bank Account",
        // placeholder: "Bank Account",
        label: "Số tài khoản ngân hàng",
        placeholder: "Số tài khoản ngân hàng",
        type: "text",
    },
    {
        id: 7,
        name: "address",
        // label: "Address",
        // placeholder: "Address",
        label: "Địa chỉ",
        placeholder: "Địa chỉ",
        type: "text",
    },
];

const userInputs = [
    {
        id: 1,
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "Username",
        required: true,
    },
    {
        id: 2,
        name: "password",
        label: "Password",
        type: "text",
        placeholder: "Password",
    },
    {
        id: 3,
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Name",
    },
    {
        id: 4,
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Email",
    },
    {
        id: 5,
        name: "phone",
        label: "Phone",
        type: "text",
        placeholder: "Phone",
    },
    {
        id: 6,
        name: "birthday",
        label: "Birthday",
        type: "date",
        placeholder: "Birthday",
    },
    {
        id: 7,
        name: "role",
        label: "Role",
        type: "select",
        placeholder: "Role",
        options: ["sale", "manager", "dev", "mod", "admin"],
    },
];

const taskInputs = [
    {
        id: 1,
        name: "userId",
        // label: "Seller",
        // placeholder: "Seller",
        label: "Nhân viên",
        placeholder: "Nhân viên",
        type: "select",
        required: true,
    },
    {
        id: 2,
        name: "title",
        // label: "Container",
        // placeholder: "Container",
        label: "Mã cont",
        placeholder: "Mã cont",
        type: "select",
        required: true,
    },
    {
        id: 3,
        name: "desc",
        // label: "Description",
        // placeholder: "Description",
        label: "Mô tả",
        placeholder: "Mô tả",
        type: "text",
    },
];

export {
    profileInputs,
    passwordInputs,
    categoryInputs,
    productInputs,
    productInputsAdmin,
    customerInputs,
    userInputs,
    taskInputs,
};
