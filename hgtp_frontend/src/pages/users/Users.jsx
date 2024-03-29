import "./users.scss";
import Datatable from "components/datatable/Datatable";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "utils/apiAxios";
import dateFormat from "dateformat";

const userColumns = [
    {
        field: "id",
        headerName: "Id",
        width: 88,
    },
    {
        field: "username",
        // headerName: "User",
        headerName: "User",
        flex: 1,
        renderCell: (params) => {
            return <div className="cellUser">{params.row.username}</div>;
        },
    },
    {
        field: "name",
        // headerName: "Name",
        headerName: "Tên",
        flex: 1,
    },
    {
        field: "email",
        headerName: "Email",
        flex: 1,
    },
    {
        field: "phone",
        // headerName: "Phone",
        headerName: "SĐT",
        flex: 1,
    },
    {
        field: "birthday",
        // headerName: "Birthday",
        headerName: "Ngày sinh nhật",
        flex: 1,
        renderCell: (params) => {
            return params.row.birthday ? (
                <div className="cellUser">
                    {dateFormat(params.row.birthday, "dd-mm-yyyy")}
                </div>
            ) : (
                ""
            );
        },
    },
    {
        field: "role",
        headerName: "Role",
        flex: 0.5,
        renderCell: (params) => {
            return (
                <div className={`cellRole ${params.row.role}`}>
                    {params.row.role}
                </div>
            );
        },
    },
];

const Users = () => {
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await apiRequest.get(`/users`);
            const users = res.data?.map((data, index) => {
                return {
                    ...data,
                    id: index + 1,
                };
            });
            return users;
        },
    });

    return (
        <div className="users">
            <div className="usersTop">
                <h1 className="title">Tất cả User</h1>
                <button
                    onClick={() => {
                        navigate(`/users/new`);
                    }}
                    className="addButton"
                >
                    Thêm mới
                </button>
            </div>
            <div className="usersBottom">
                {isLoading ? (
                    "Loading..."
                ) : error ? (
                    error.response?.data.message
                ) : (
                    <Datatable
                        target="users"
                        rows={data}
                        columns={userColumns}
                    />
                )}
            </div>
        </div>
    );
};

export default Users;
