import "./datatable.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "utils/apiAxios";

const Datatable = ({ target, rows, columns, name }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async (id) => {
            await apiRequest.delete(`/${target}/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries([`${target}`]);
            navigate(`/${target}`);
        },
    });

    const handleDelete = async (id, title) => {
        const deleteConfirm = window.confirm(`Bạn thực sụ muốn xóa ${title}`);

        if (deleteConfirm) {
            mutate(id);
        }
    };

    const handleView = async (id) => {
        navigate(`/${target}/${id}`);
    };

    const actionColumn = [
        {
            field: "Actions",
            headername: "Actions",
            width: 155,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <button
                            className="viewButton"
                            onClick={() => {
                                if (target === "products") {
                                    handleView(params.row.productId);
                                } else {
                                    handleView(params.row._id);
                                }
                            }}
                        >
                            Xem
                        </button>

                        <button
                            className="deleteButton"
                            onClick={() => {
                                if (target === "products") {
                                    handleDelete(
                                        params.row.productId,
                                        params.row.productId
                                    );
                                } else {
                                    handleDelete(
                                        params.row._id,
                                        params.row.title || params.row.name
                                    );
                                }
                            }}
                        >
                            Xóa
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="datatable">
            <DataGrid
                className="datagrid"
                rows={rows || []}
                columns={columns.concat(actionColumn)}
                slots={{ toolbar: GridToolbar }}
                autoPageSize
                disableRowSelectionOnClick
            />
        </div>
    );
};

export default Datatable;
