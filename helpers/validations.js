// Validate the customer details in case of creating or updating a customer.
module.exports.ValidateResult = class ValidateResult {
    constructor(isValid, errorMessage) {
        this.isValid = isValid;
        this.errorMessage = errorMessage;
    }
};