

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
    if (fieldValue) {
        // filedValue is not empty
        switch (fieldName) {
            // validate productID
            case `${formTypes.productInputs[0].name}`:            
                if (!cont_pattern.test(fieldValue)) {
                        err.name = "Lỗi định dạng"
                        err.reason = 'Mã cont phải đủ 11 ký tự gồm  4 chữ cái đầu và 7 số đuôi'
                        return false
                }
                break;
    
            // Fall-through purpose is to validate money-related inputs
            case `${formTypes.productInputs[2].name}`: // price
            case `${formTypes.productInputs[3].name}`: // deposit
            case `${formTypes.productInputs[4].name}`: // amount
                // Same logic
                if (!money_pattern.test(fieldValue)) {
                        err.name = "Lỗi"
                        err.reason = "Không phải là dạng số nguyên dương [1-9]"
                        return false
                }
                break;
    
            default:
                break;
        }
    }    
    // Default return true
    return true
}

// Export functions
export {
    validateProductForm
}
