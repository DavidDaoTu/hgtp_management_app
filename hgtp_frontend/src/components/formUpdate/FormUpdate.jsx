import "./formUpdate.scss";
import { DriveFolderUploadOutlined, EastOutlined } from "@mui/icons-material";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "utils/apiAxios";
import { formReducer } from "utils/formReducer";
import defaultImage from "assets/images/no-image.jpg";
import dateFormat from "dateformat";
import {validateProductForm} from 'utils/formValidtion'

const FormUpdate = ({ inputs, image, obj, route, id }) => {
    const navigate = useNavigate();

    const [formObject, dispatch] = useReducer(formReducer, {
        ...obj,
        birthday: obj?.birthday && dateFormat(obj?.birthday, "yyyy-mm-dd"),
        saleDate: obj?.saleDate && dateFormat(obj?.saleDate, "yyyy-mm-dd"),
        arrivalDate:
            obj?.arrivalDate && dateFormat(obj?.arrivalDate, "yyyy-mm-dd"),
        deliveryDate:
            obj?.deliveryDate && dateFormat(obj?.deliveryDate, "yyyy-mm-dd"),
    });
    const [file, setFile] = useState(obj?.image);
    const [isSuccess, setIsSuccess] = useState(false);
    // errors state for validating input fields
    const [inputErrors, setInputErrors] = useState([{
        name: '',
        reason: '',
    },]);

    const queryClient = useQueryClient();

    const handleChange = (e) => {
        e.preventDefault();
        
        const inputField = {
            fieldName: e.target.name,
            fieldValue: e.target.value,
            err: inputErrors
        }
        // Inputs validation
        if (validateProductForm(inputField)) { 
            // if validation passed
            // Reset errors of success inputs
            const newInputErrors = inputErrors.map(e =>
              e.name === inputField.fieldName ? {name: "", reason: ""} : e
            )
            setInputErrors(newInputErrors)
        } else { 
            // if validation failed
            // Set Error State
            setInputErrors(inputErrors)
        }

        dispatch({
            type: "CHANGE_INPUT",
            payload: { name: inputField.fieldName, value: inputField.fieldValue },
        });
        
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            setFile(URL.createObjectURL(file));
        } else {
            setFile(file);
        }

        if (file) {
            const image = file;
            dispatch({
                type: "ADD_AVATAR",
                payload: { image },
            });
        }
    };

    const {
        isLoading: isLoadingPut,
        error: errorPut,
        mutate: mutatePut,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await apiRequest.put(`/${route}/${id}`, formData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries([`/${route}`]);
            setIsSuccess(true);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in formObject) {
            formObject[key] != null && formData.append(key, formObject[key]);
        }
        mutatePut(formData);
    };

    return (
      <div className="formUpdate">
        <form action="" onSubmit={handleSubmit}>
          <div
            className="top"
            style={{ display: isSuccess ? "flex" : "none" }}
            onClick={() => {
              route === "auth"
                ? navigate(`/${obj.username}`)
                : navigate(`/${route}/${formObject.productId || id}`);
            }}
          >
            <div className="success">Update Successful</div>
            <EastOutlined className="icon" />
          </div>

          <div className="bottom">
            {image && (
              <div className="left">
                <div className="uploadImage">
                  <label htmlFor="file">
                    <div className="formUpload">
                      <div>Upload Image </div>
                      <DriveFolderUploadOutlined className="icon" />
                    </div>
                    <img
                      src={file || defaultImage}
                      alt="avata"
                      htmlFor="file"
                    />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => handleUpload(e)}
                  />
                </div>
              </div>
            )}
            <div className="right">
              <div className="formInput">
                {inputs?.map((value, index) => (
                  <div className="input" key={index}>
                    <label>{value.label}</label>
                    {value.type === "select" ? (
                      <select
                        id={value.name}
                        name={value.name}
                        type={value.type}
                        value={formObject[value.name] || ""}
                        onChange={(e) => handleChange(e)}
                        required={value.required}
                      >
                        {value.options?.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="input-section">
                        <input
                          id={value.name}
                          name={value.name}
                          type={value.type}
                          placeholder={value.placeholder}
                          value={formObject[value.name] || ""}
                          onChange={(e) => handleChange(e)}
                          required={value.required}
                        />
                        <div 
                            className="error-msg"
                            style={{display: inputErrors.filter(e => e.name === value.name)[0] ? "flex" : "none"}}
                        >
                            <div className="show">
                                {inputErrors.filter(e => e.name === value.name)[0]?.reason} 
                            </div>
                        </div> 
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="error">
                {errorPut && errorPut.response.data.message}
              </span>
              <div className="sendButton">
                {isLoadingPut ? (
                  <div className="button">Uploading...</div>
                ) : (
                  <button type="submit" className="button">
                    Send
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
};

export default FormUpdate;
