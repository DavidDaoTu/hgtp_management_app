import "./importProducts.scss";
import { FileUploadOutlined, FileDownloadOutlined } from "@mui/icons-material";
import Datatable from "components/datatable/Datatable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "utils/apiAxios";
import { useState } from "react";
import dateFormat from "dateformat";
import * as XLSX from "xlsx";
import fileExcel from "assets/files/default.xlsx";
import { getDateFromExcelDateNumber } from "utils/format.helper";

const productColumns = [
  {
    field: "id",
    headerName: "Id",
    width: 88,
  },
  {
    field: "productId",
    headerName: "Cont",
    flex: 1,
  },
  {
    field: "saleDate",
    headerName: "Ngày bán",
    flex: 1,
    renderCell: (params) => {
      return params.row.saleDate ? (
        <div className="cellUser">
          {dateFormat(params.row.saleDate, "dd-mm-yyyy")}
        </div>
      ) : (
        ""
      );
    },
  },
  {
    field: "arrivalDate",
    headerName: "Ngày về",
    flex: 1,
    renderCell: (params) => {
      return params.row.arrivalDate ? (
        <div className="cellUser">
          {dateFormat(params.row.arrivalDate, "dd-mm-yyyy")}
        </div>
      ) : (
        ""
      );
    },
  },
  {
    field: "deliveryDate",
    headerName: "Ngày giao",
    flex: 1,
    renderCell: (params) => {
      return params.row.deliveryDate ? (
        <div className="cellUser">
          {dateFormat(params.row.deliveryDate, "dd-mm-yyyy")}
        </div>
      ) : (
        ""
      );
    },
  },
  {
    field: "desc",
    headerName: "Mô tả",
    flex: 1,
  },
  {
    field: "port",
    headerName: "Cảng",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    flex: 1,
    renderCell: (params) => {
      return (
        <div className={`status ${params.row.status}`}>{params.row.status}</div>
      );
    },
  },
];

const Products = () => {
  const [productsData, setProductsData] = useState([]);
  const [filename, setFilename] = useState("");

  const queryClient = useQueryClient();

  const { mutate: mutatePost } = useMutation({
    mutationFn: async (formData) => {
      const res = await apiRequest.post(`/products`, formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`products`]);
    },
  });

  const { mutate: mutatePut } = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await apiRequest.put(`/products/${id}`, formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`products`]);
    },
  });

  const handleFileUpload = (e) => {
    const regex = /^[A-Z]{4}\d{7}$/;

    if (e.target.files.length) {
      const file = e.target.files[0];
      setFilename(file.name);
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        let key = 1;

        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet1Name = workbook.SheetNames[0];
        const sheet1 = workbook.Sheets[sheet1Name];
        const parsedDataSheet1 = XLSX.utils.sheet_to_json(sheet1);
        const pendingProducts = parsedDataSheet1
          ?.slice(1)
          .filter((value) => value && regex.test(value["__EMPTY_1"]?.trim()))
          .map((value) => {
            return {
              productId: value["__EMPTY_1"]?.trim(),
              arrivalDate: getDateFromExcelDateNumber(value["__EMPTY_2"]),
              desc: value["__EMPTY_8"],
              port: value["__EMPTY_4"],
              status: "pending",
              id: key++,
            };
          })
          .filter((value) => value.productId);

        const sheet2Name = workbook.SheetNames[1];
        const sheet2 = workbook.Sheets[sheet2Name];
        const parsedDataSheet2 = XLSX.utils.sheet_to_json(sheet2);
        const deliveredProducts = parsedDataSheet2
          ?.slice(1)
          .filter((value) => value && regex.test(value["Số Container"]?.trim()))
          .map((value) => {
            return {
              productId: value["Số Container"]?.trim(),
              deliveryDate: getDateFromExcelDateNumber(value["Ngày giao hàng"]),
              desc: value["Note"],
              port: value["Cảng"],
              status: "done",
              id: key++,
            };
          })
          .filter((value) => value.productId);

        setProductsData([...deliveredProducts, ...pendingProducts]);
      };
    }
  };

  const handleInsertData = () => {
    productsData?.map(async (value) => {
      try {
        const res = await apiRequest.get(`/products/${value.productId}`);
        if (res.status === 200) {
          mutatePut({ id: value.productId, formData: value });
        }
      } catch (error) {
        if (error.response.status === 404) {
          mutatePost(value);
        }
      }
    });
  };

  return (
    <div className="importProducts">
      <div className="productsTop">
        <div className="productsTitle">
          <h1 className="title">Nhập dự liệu Cont</h1>
          <div className="buttons">
            <button className="importButton" onClick={handleInsertData}>
              Nhập dữ liệu
            </button>
          </div>
        </div>
        <div className="productsMenu">
          <div className="importFile">
            <label htmlFor="importFile" className="fileLabel link">
              <FileUploadOutlined className="icon" />
              IMPORT
            </label>
            <input
              type="file"
              id="importFile"
              accept=".xlsx, .xls, .csv"
              className="fileInput"
              onChange={handleFileUpload}
            />
            <span className="fileName">{filename && filename}</span>
          </div>
          <div className="exportFile">
            <a
              // href="src/assets/files/default.xlsx"
              href={fileExcel}
              download="default.xlsx"
              className="fileLink link"
            >
              <FileDownloadOutlined className="icon" />
              Tải về File mẫu
            </a>
          </div>
        </div>
      </div>
      <div className="productsBottom">
        <div className="listView">
          {productsData && (
            <Datatable
              target="products"
              rows={productsData}
              columns={productColumns}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
