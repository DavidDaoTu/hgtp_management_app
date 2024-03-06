

import * as formTypes from './inputForm'

/**
 * Validate input changes here.
 * - Arguments: {fieldName, fieldValue, err}
 * - Returns: boolean
 *      + true: if pass the input validation
 *      + false: if failed 
 */
const productPattern = /^[a-zA-Z]{4}\d{7}$/
const moneyPattern = /^\d+$/

const validateProductForm = ({fieldName, fieldValue, err}) => {
    if (fieldValue) {
        let newError = {
            name: fieldName,
            reason: ''
        }
        // filedValue is not empty
        switch (fieldName) {
            // validate productID
            case `${formTypes.productInputs[0].name}`:  // productId
                if (!productPattern.test(fieldValue)) {
                    newError.reason = 'Lỗi định dạng: Mã cont phải đủ 11 ký tự gồm  4 chữ cái đầu và 7 số đuôi'                    
                    err[0] = newError
                    return false
                }
                break;

            case `${formTypes.productInputs[2].name}`: // price
                if (!moneyPattern.test(fieldValue)) {
                    newError.reason = 'Lỗi: Không phải là dạng số nguyên dương [1-9]'
                    err[2] = newError
                    return false
                }
                break;

            case `${formTypes.productInputs[3].name}`: // deposit
                if (!moneyPattern.test(fieldValue)) {
                    newError.reason = 'Lỗi: Không phải là dạng số nguyên dương [1-9]'
                    err[3] = newError
                    return false
                }
                break;

            case `${formTypes.productInputs[4].name}`: // amount
                if (!moneyPattern.test(fieldValue)) {
                    newError.reason = 'Lỗi: Không phải là dạng số nguyên dương [1-9]'
                    err[4] = newError
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
