const config = require("../config/config");
function pagination(req){
    let limit = parseInt(req.query.limit) || config.pagination.limit;
    if (limit > config.pagination.maxLimit) limit = config.pagination.maxLimit;
    let page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * limit;
    return { limit, skip };
}
function capitalizeFirstLetter(str) {
    if (!str || typeof str !== "string") return str; // Handle non-string inputs
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function stringToSlug(str){
    if (!str || typeof str !== "string") return str; // Handle non-string inputs
    return str.toLowerCase().replace(/ /g, "-");
}
  
  
module.exports = {
    pagination,
    capitalizeFirstLetter,
    stringToSlug
}