var commonFunction = {

    getResultSet: async function (resultSet) {
        try {
            const columns = [];
            const finalData = [];
            let header = [];
            for (let i = 0; i < resultSet.metaData.length; i++) {
                header.push((resultSet.metaData[i].name));
            }
            for (let i = 0; i < resultSet.metaData.length; i++) {
                var obj = {};
                obj.title = resultSet.metaData[i].name;
                obj.field = header[i];
                columns.push(obj);
            }
            while ((row = await resultSet.getRow())) {
                const data = new Object();
                columns.forEach((element, index) => {
                    data[element.title] = row[index];
                });
                finalData.push(data);
            }
            return finalData;
        } catch (exception) {
            throw exception;
        }



    },
    getLoginErrRes: function (result, error, msg) {
        const errorObj = {
            result: result,
            error: error,
            msg: msg,
            errorType: error,
            statusCode: 400

        };
        return JSON.stringify(errorObj);
    },
    getErrorResponse: function (result, error, msg) {
        const errorObj = {
            result: result,
            msg: msg,
            errorType: error,
            statusCode: 400

        };
        return JSON.stringify(errorObj);
    },
    // getLoginErrRes: function (result, error, msg) {
    //     const errorObj = {
    //         result: result,
    //         error: error,
    //         msg: msg,
    //         errorType: error,
    //         statusCode: 400
    //     };

    //     return JSON.stringify(errorObj);

    // },

    getLoginSuccessResponse: function (result, obj = '', result1) {

        const errorObj = {
            result: result,
            result1: result1,
            errorType: '',
            statusCode: 200,
            propertyObj: obj
        };
        return JSON.stringify(errorObj);

    },
    getSuccessResponse: function (result, obj = '', msg = '') {

        const errorObj = {
            result: result,
            errorType: '',
            statusCode: 200,
            propertyObj: obj
        };
        return JSON.stringify(errorObj);

    },

    recordNotFoundResponse: function (result) {

        const errorObj = {
            result: '',
            statusCode: 404,
            paramObj: ''
        };
        return JSON.stringify(errorObj);

    },
    //this function is used for only execute billing query
    getResultSetManually: async function (resultSet) {
        try {
            const finalData = [];
            while ((row = await resultSet.getRow())) {
                finalData.push(row);
            }
            return finalData;
        } catch (exception) {
            throw exception;
        }
    },


    getResultSetExecuteQuery: async function (resultSet) {
        try {
            var finalData = [];
            while ((row = await resultSet.getRow())) {



                var objfilterData = {};
                for (var [key, value] of Object.entries(row)) {

                    if (value instanceof Date && !isNaN(value)) {
                        value = formatDate(value);
                    }

                    // if (value != null && typeof value === 'object') {
                    //     value = formatDate(value);
                    // }
                    objfilterData[`${key}`] = `${value === null || value === 'null' ? '' : value}`;


                }
                finalData.push(objfilterData);

            }
            return finalData;
        } catch (exception) {
            throw exception;
        }
    },





};

// Function to format date to "DD/MM/YYYY"
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};






module.exports = commonFunction;