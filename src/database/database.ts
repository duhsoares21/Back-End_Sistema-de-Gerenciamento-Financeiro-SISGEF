import { ResultSetHeader } from 'mysql2';
import { FilterByMonthParams, FilterParams, InsertParams, SelectParams, UpdateParams, DeleteParams } from '../types/types'
import pool from './connection';

export async function selectAll({ table } : SelectParams) {
    const connection = await pool.connect();

    const query = await connection.query('SELECT * FROM ?', [table]);

    const result = query.rows;

    connection.release();

    return result;
}

export async function select({ table, fields } : SelectParams) {
    const connection = await pool.connect();
	
    const fieldsList = fields?.join(", ");

    const query = await connection.query(`SELECT ? FROM ?`, [fieldsList, table]);

    const result = query.rows;

    connection.release();

    return result;
}

export async function selectCategoriasAlfabetica({ table, fields } : SelectParams) {
    const connection = await pool.connect();

    const fieldsList = fields?.join(", ");

    const query = await connection.query(`SELECT ? FROM ? ORDER BY categoria ASC`, [fieldsList, table]);

    const result = query.rows;

    connection.release();

    return result;
}

export async function selectBy({ table, filter, filterValue } : FilterParams) {
    const connection = await pool.connect();

    const query = await connection.query(`SELECT * FROM ? WHERE ? = ?`, [table, filter, filterValue]);

    const result = query.rows;

    connection.release();

    return result;
}

export async function selectByMonth({ table, month, year } : FilterByMonthParams) {
    const connection = await pool.connect();

    const query = await connection.query(`SELECT * FROM ? WHERE EXTRACT(MONTH FROM data) = ? AND EXTRACT(YEAR FROM data) = ? ORDER BY id`, [table, month, year]);

    const result = query.rows;

    connection.release();

    return result;
}

export async function selectTotalSaldoByMonth({month, year} : FilterByMonthParams) {
    const connection = await pool.connect();

    const query = await connection.query(`SELECT COALESCE(SUM(valor), 0) as TotalEntradas, (SELECT COALESCE(SUM(valor), 0) from saidas WHERE EXTRACT(MONTH FROM data) = ? AND EXTRACT(YEAR FROM data) = ?) as TotalSaidas, (COALESCE(SUM(valor), 0) - (SELECT COALESCE(SUM(valor), 0) FROM saidas WHERE EXTRACT(MONTH FROM data) = ? AND EXTRACT(YEAR FROM data) = ?)) AS Saldo FROM entradas WHERE EXTRACT(MONTH FROM data) = ? AND EXTRACT(YEAR FROM data) = ?;`, [month, year, month, year, month, year])

    const result = query.rows;

    connection.release();

    return result;
}

export async function selectCategoriasPercentage({month, year} : FilterByMonthParams) {
    const connection = await pool.connect();

    const query = await connection.query(`SELECT categoria, SUM(valor) AS total, ROUND((SUM(valor) / (SELECT SUM(valor) FROM saidas WHERE EXTRACT(MONTH FROM data) = ? AND EXTRACT(YEAR FROM data) = ?)) * 100, 2) AS percentage FROM saidas WHERE EXTRACT(MONTH FROM data) = ? AND EXTRACT(YEAR FROM data) = ? GROUP BY categoria;`, [month, year, month, year])

    const result = query.rows;

    connection.release();

    return result;
}

export async function sumByMonth({ table, month, year } : FilterByMonthParams) {
    const connection = await pool.connect();

    const query = await connection.query(`SELECT SUM(valor) as total FROM ? WHERE EXTRACT(MONTH FROM data) = ? AND EXTRACT(YEAR FROM data) = ?`, [table, month, year]);

    const result = query.rows;

    connection.release();

    return result;
}

export async function insert({ table, fields, values } : InsertParams) {

    const connection = await pool.connect();

    const fieldsList = fields?.join(", ");
	
    const valuesList = values?.map(value => typeof value === 'string' ? `'${value}'` : `${value}`).join(", ");

    let result;

    try 
    {
        const query = await connection.query(`INSERT INTO ${table} (?) VALUES (?)`, [fieldsList, valuesList]);

        const rowCount = query.rowCount === null ? 0 : query.rowCount;

        const inserted =  rowCount > 0 ? true : false;

        if(inserted) {
            result = true;
        }
    } 
    catch(erro) 
    {
        result = false;
    }

    connection.release();

    return result;
}

export async function updateById({ id, table, fields, values } : UpdateParams) {
    
    const connection = await pool.connect();

    let queryExtension = '';

    for(let i = 0; i < fields.length; i++) {
        const valueFormat = typeof values[i] === 'string' ? `'${values[i]}'` : `${values[i]}`;
        queryExtension += fields[i]+" = "+valueFormat+", ";
    }

    queryExtension = queryExtension.trim().slice(0, -1);

    let result;

    try 
    {
        const query = await connection.query(`UPDATE ? SET ? WHERE id = ?`, [table, queryExtension, id]);
        const rowCount = query.rowCount === null ? 0 : query.rowCount;

        const updated =  rowCount > 0 ? true : false;

        if(updated) {
            result = true;
        }
    } 
    catch(erro) 
    {
        console.log(erro);
        result = false;
    }

    connection.release();

    return result;
}

export async function deleteById({ id, table } : DeleteParams) {
    const connection = await pool.connect();

    let result; 
    
    try 
    {
        const query = await connection.query(`DELETE FROM ? WHERE id = ?`, [table, id]);
        const rowCount = query.rowCount === null ? 0 : query.rowCount;

        const deleted =  rowCount > 0 ? true : false;

        if(deleted) {
            result = true;
        }
    } 
    catch(erro) 
    {
        result = false;
    }

    connection.release();

    return result;
}
