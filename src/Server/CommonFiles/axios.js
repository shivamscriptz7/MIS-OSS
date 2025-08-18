/**
 * Import Module
 */
const axios = require('axios');

/**
 * Global Variable
 */
let axiosCtrl = {};


/**
 * Post api for axios
 * @Developer Rahul Kumar
 */
axiosCtrl.postAxios = (params) => {
    return new Promise((resolve, reject) => {
        try {
            //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            axios(params).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}



module.exports = axiosCtrl;