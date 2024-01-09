

const pool = require('../db');

const saveTransaction = async (tableName, data) => {
    const insertQuery = `
    INSERT INTO "${tableName}" (idtrx, tujuan, kodeproduk, request, response, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (idtrx) DO UPDATE
    SET tujuan = $2, kodeproduk = $3, request = $4, response = $5, updated_at = $7
    RETURNING *`;

    const { idtrx, tujuan, kodeproduk, request, response, created_at } = data;
    const values = [idtrx, tujuan, kodeproduk, request, response, created_at, new Date()];

    try {
        const { rows } = await pool.query(insertQuery, values);
        return rows[0];
    } catch (error) {
        console.error('Error executing query:', error.stack);
        throw error;
    }
};


const findTransactionByIdtrx = async (tableName, idtrx) => {
    const selectQuery = `
    SELECT * FROM "${tableName}"
    WHERE idtrx = $1
  `;

    try {
        const { rows } = await pool.query(selectQuery, [idtrx]);
        return rows[0]; // Assuming you expect only one record with a given idtrx
    } catch (error) {
        console.error('Error executing query:', error.stack);
        throw error;
    }
};



module.exports = {
    saveTransaction,
    findTransactionByIdtrx,
};



