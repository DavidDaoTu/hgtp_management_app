import "./formProduct.scss";
import { DriveFolderUploadOutlined, EastOutlined } from "@mui/icons-material";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest, cloudinaryUpload } from "utils/apiAxios";
import { formReducer, initialState } from "utils/formReducer";
import defaultImage from "assets/images/no-image.jpg";
import {validateProductForm} from 'utils/formValidtion'

const FormProduct = ({ inputs }) => {
    const [formObject, dispatch] = useReducer(formReducer, initialState);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // errors states for validating input fields
    const [inputErrors, setInputErrors] = useState([{
        name: '',
        reason: '',
    },]);
   
    // Display Input Object States
    const [displayInputs, setDisplayInputs] = useState(inputs.map(inp => ({name: inp.name, display: inp.display})));

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    /**
     * Handle changes of input fields
     * @param {*} e 
     */
    const handleChange = (e) => {
        e.preventDefault();
        // check display inputs
        if (e.target.tagName.toLowerCase() === 'select') {
            switch (e.target.value) {
                case 'sold':
                    // Set all inputs display is 'show'
                    setDisplayInputs(displayInputs.map(inp => ({...inp, display: 'show'})));
                    break;
                case 'pending':
                    // Set to default display
                    setDisplayInputs(inputs.map(inp => ({...inp, display: inp.display})));
                    break;
                default:                    
                    break;
            }
        }        

        // Inputs validation
        const inputField = {
            fieldName: e.target.name,
            fieldValue: e.target.value,
            err: inputErrors
        }
        if (validateProductForm(inputField)) { 
            // if validation passed
            // Reset errors of success inputs 
            const newInputErrors = inputErrors.map(e =>
              e.name === inputField.fieldName ? {name: "", reason: ""} : e
            );
            setInputErrors(newInputErrors);
        } else { 
            // if validation failed
            // Set Error State
            setInputErrors(inputErrors);
        }

        dispatch({
            type: "CHANGE_INPUT",
            payload: { name: inputField.fieldName, value: inputField.fieldValue },
        });
    };


    /**
     * Handle Upload Events
     * @param {*} e 
     */
    const handleUpload = async (e) => {
        e.preventDefault();
        const files = e.target.files;
        setFiles(files);
        try {
            setUploading(true);
            const cover = await cloudinaryUpload(files[0]);

            const images = await Promise.all(
                [...files]?.map(async (file) => {
                    const url = await cloudinaryUpload(file);
                    return url;
                })
            );

            dispatch({
                type: "ADD_IMAGES",
                payload: { cover, images },
            });
            setUploading(false);
        } catch (err) {
            console.log(err.message);
        }
    };

    const { isLoading, error, mutate } = useMutation({
        mutationFn: async (formObject) => {
            await apiRequest.post("/products", formObject);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            setIsSuccess(true);
        },
    });

    /**
     * Handle Submit Form
     * @param {*} e 
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in formObject) {
            // We don't save data of 'hide' display
            const display = displayInputs.filter(inp => inp.name === key)[0]?.display
            if (display !== 'hide') {
                // Won't save if no data
                formObject[key] && formData.append(key, formObject[key]);  
            } 
        }
        console.log("formData = ", formData)
        mutate(formData);
    };

    // Return a JSX component
    return (
        <div className="formProduct">
            <form action="" onSubmit={handleSubmit}>
                <div
                    className="top"
                    style={{ display: isSuccess ? "flex" : "none" }}
                    onClick={() => {
                        navigate(`/products/${formObject.productId}`);
                    }}
                >
                    <div className="success">Create Successful</div>
                    <EastOutlined className="icon" />
                </div>
                <div className="bottom">
                    <div className="left">
                        <label htmlFor="file">
                            <div className="formUpload">
                                <div>Upload Image </div>
                                <DriveFolderUploadOutlined className="icon" />
                            </div>
                            <img
                                src={
                                    files[0]
                                        ? URL.createObjectURL(files[0])
                                        : defaultImage
                                }
                                alt="avata"
                                htmlFor="file"
                            />
                        </label>
                        <input
                            type="file"
                            id="file"
                            multiple
                            onChange={(e) => {
                                handleUpload(e);
                            }}
                        />
                    </div>
                    <div className="right">
                        <div className="formInput">
                            {inputs?.map((value, index) => (
                                <div className="input" key={index}
                                    style={{display: displayInputs[index].display === 'show' ? "flex" : "none"}}
                                >                                   
                                    <label>{value.label}</label>
                                    {value.type === "select" ? (
                                        <select
                                            name={value.name}
                                            type={value.type}
                                            onChange={(e) => handleChange(e)}
                                            required={displayInputs[index].display === 'show' ? value.required : false}
                                        >
                                            {value.options?.map(
                                                (option, index) => (
                                                    <option
                                                        key={index}
                                                        value={option.value}
                                                    >
                                                        {option.title}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    ) : (
                                        <div className="input-section">
                                            <input
                                                name={value.name}
                                                type={value.type}
                                                placeholder={value.placeholder}
                                                onChange={(e) => handleChange(e)}
                                                required={displayInputs[index].display === 'show' ? value.required : false}
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
                            {error && error.response?.data.message}
                        </span>
                        <div className="sendButton">
                            {uploading || isLoading ? (
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

export default FormProduct;
