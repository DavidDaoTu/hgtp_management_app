import "./productDetail.scss";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "utils/apiAxios";
import defaultImage from "assets/images/no-image.jpg";
import dateFormat from "dateformat";
import { getStatusMessage } from "utils/common";

const ProductDetail = ({ product }) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ["categories", product?.categoryId],
        queryFn: async () => {
            const res = await apiRequest.get(
                `/categories/${product?.categoryId}`
            );
            return res.data;
        },
        enabled: !!product?.categoryId,
    });

    return (
        <div className="productDetail">
            <div className="productItems">
                <div className="itemImage">
                    <img
                        src={product?.cover || defaultImage}
                        alt=""
                        className="image"
                    />
                </div>
                <h1 className="itemTitle">{product?.productId}</h1>
                {product?.categoryId &&
                    (isLoading ? (
                        "Loading..."
                    ) : error ? (
                        error.response?.data.message
                    ) : (
                        <div className="itemDetail">{data.title}</div>
                    ))}
                {product?.desc && (
                    <div className="itemDetail">{product?.desc}</div>
                )}
                {product?.price && (
                    <div className="itemDetail">
                        <span>Giá bán: {product?.price}</span>
                    </div>
                )}
                {product?.deposit && (
                    <div className="itemDetail">
                        <span>Đặt cọc: {product?.deposit}.000.000</span>
                    </div>
                )}
                {product?.saleDate && (
                    <div className="itemDetail">
                        <span>
                            {"Ngày bán: "}
                            {dateFormat(product?.saleDate, "dd-mm-yyyy")}
                        </span>
                    </div>
                )}
                {product?.arrivalDate && (
                    <div className="itemDetail">
                        <span>
                            {"Ngày hàng về: "}
                            {dateFormat(product?.arrivalDate, "dd-mm-yyyy")}
                        </span>
                    </div>
                )}
                {product?.deliveryDate && (
                    <div className="itemDetail">
                        <span>
                            {"Ngày giao hàng: "}
                            {dateFormat(product?.deliveryDate, "dd-mm-yyyy")}
                        </span>
                    </div>
                )}
                {product?.port && (
                    <div className="itemDetail">
                        <span>Cảng: {product?.port}</span>
                    </div>
                )}
                {product?.document && (
                    <div className="itemDetail">
                        <span>Bill: {product?.document}</span>
                    </div>
                )}
                {product?.status && (
                    <div className="itemDetail">
                        <span className={`status ${product?.status}`}>
                            {getStatusMessage(product?.status)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
