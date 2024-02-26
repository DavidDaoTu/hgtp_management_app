

import * as formTypes from './inputForm'

/**
 * Validate input changes here.
 * - Input arguments: {fieldName, fieldValue}
 *  - Returns: boolean
 *      + true: if pass the input validation
 *      + false: if failed 
 */
const cont_pattern = /^[a-zA-Z]{4}\d{7}$/
const money_pattern = /^\d+$/

const validateProductForm = ({fieldName, fieldValue, err}) => {
    switch (fieldName) {
        // validate productID
        case `${formTypes.productInputs[0].name}`:            
            if (fieldValue) {
                if (fieldValue.length > 11) {
                    err.fieldName = 'Lỗi độ dài'
                    err.errReason = 'Mã cont vượt quá 11 ký tự'
                    return false
                } else if (fieldValue.length < 11) {                    
                    err.fieldName = "Cảnh báo độ dài"
                    err.errReason = 'Mã cont chưa đủ 11 ký tự'
                    return false
                } else {
                    if (!cont_pattern.test(fieldValue)) {
                        err.fieldName = "Lỗi định dạng"
                        err.errReason = 'Mã cont phải bắt đầu 4 chữ cái đầu và 7 số đuôi'
                        return false
                    }
                }
            }
            break;

        // Fall-through purpose is to validate money-related inputs
        case `${formTypes.productInputs[2].name}`: // price
        case `${formTypes.productInputs[3].name}`: // deposit
        case `${formTypes.productInputs[4].name}`: // amount
            // Same logic
            if (fieldValue) {
                if (fieldValue[0] === '-') {
                    err.fieldName = "Lỗi"
                    err.errReason = "Tiền không được âm"
                    return false
                } else if (!money_pattern.test(fieldValue)) {
                    err.fieldName = "Lỗi"
                    err.errReason = "Không phải là dạng số [1-9]"
                    return false
                }
            }
            break;

        default:
            break;
    }
    // Default return true
    return true
}

// Export functions
export {
    validateProductForm
}
