/*
 * Project Name: BSNL_CONS_MIS.
 * Date: 20/08/2025
 * Author: Kajal Gulyani
 * Contact: Echelon Edge BSNL CONS MIS Development Team.
 * Copyright: Echelon Edge Pvt. Ltd.
 */

"use strict";

const { Pool } = require('pg');
const config = require('../../../config.json');

let connection;

var dbConnection = new Promise((resolve, reject) => {
    try {
        const pool = new Pool({
            user: 'postgres',
            password: 'India@123',
            host: 'localhost',
            port: 5432,
            database: 'MIS',
            max: 20 // Equivalent to poolMax in Oracle
        });

        pool.connect((err, client, release) => {
            if (err) {
                console.log("ERROR: ", new Date(), ": Pool connect callback: " + err.message);
                reject(err);
            } else {
                console.log("Database connected-" + ' ' + new Date());
                resolve(client);
            }
        });

    } catch (e) {
        console.log("error", e);
        reject(e);
    }
});

module.exports = { dbConnection };