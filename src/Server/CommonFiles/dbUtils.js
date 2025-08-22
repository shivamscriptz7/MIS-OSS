//const { dbConnection } = require('./db');
const { dbConnection } = require('./connection');

async function executeQuery(queryText, queryParams = [], useTransaction = true) {
    let client, release;
    try {
        // Resolve dbConnection to get client and release
        const db = await dbConnection;
        client = db.client;
        //release = db.release;

        // Start transaction if needed
        if (useTransaction) {
            await client.query('BEGIN');
        }

        // Execute query
        await client.query(queryText, queryParams);
        // await client.query(`CALL get_update_login_flag($1,$2,$3,$4,$5) `, ['superadmin', null, null, 0, 'mycursor']);
        const curDataRes = await client.query('FETCH ALL IN "mycursor"');
        const finalData = curDataRes.rows;

        console.log(curDataRes, "ppppppp")
        // Commit transaction if needed
        if (useTransaction) {
            await client.query('COMMIT');
        }

        return finalData;
    } catch (error) {
        // Roll back transaction if needed
        if (useTransaction && client) {
            await client.query('ROLLBACK').catch(err => console.error('Rollback error:', err));
        }
        console.error('Query error:', error.message, error.detail);
        throw error;
    } finally {
        // Release the client
        if (release) {
            await release();
        }
    }
}

async function executeProcedure(procedureCall, procedureParams, cursorNames) {
    let client, release;
    console.log(cursorNames, "cursorNamescursorNames")
    try {
        const db = await dbConnection;
        client = db.client;
        console.log('Executing procedure:', procedureCall, 'with params:', procedureParams, 'and cursors:', cursorNames);
        await client.query('BEGIN');
        console.log(procedureCall, procedureParams)
        await client.query(procedureCall, procedureParams);

        const results = {};
        for (const cursor of cursorNames) {
            console.log(`Fetching cursor: ${cursor}`);
            const cursorResult = await client.query(`FETCH ALL FROM "${cursor}"`);
            if (!cursorResult.rows) {
                console.warn(`No rows returned for cursor: ${cursor}`);
            }
            results[cursor] = cursorResult.rows || [];
        }

        await client.query('COMMIT');
        console.log('Procedure results:', results);
        return results;
    } catch (error) {
        await client.query('ROLLBACK').catch(err => console.error('Rollback error:', err));
        console.error('Procedure error:', error.message, error.detail, error.stack);
        throw error;
    } if (release) {
        await release();
    }
}

module.exports = { executeQuery, executeProcedure };