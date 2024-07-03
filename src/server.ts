import fastify from 'fastify';
import cors from '@fastify/cors'

import { deleteById, insert, select, selectBy, selectByMonth, selectCategoriasAlfabetica, selectCategoriasPercentage, selectTotalSaldoByMonth, sumByMonth, updateById } from './database/database';
import { FilterByMonthParams, FilterParams, InsertParams, SelectParams, monthType, entradaType, idType, saidaType, UpdateParams, DeleteParams, yearType } from './types/types';

import {adicionarMeses} from './utils/utils';
import { env } from 'node:process';

const app = fastify();

app.register(cors, {});

app.get('/categorias', async () => {
	const tableData:SelectParams = {
		table: 'categorias',
		fields: ['id', 'categoria']
	};

	const selectData = await selectCategoriasAlfabetica(tableData);

	return selectData;
});

app.get('/categorias/:id', async (req) => {

	const {id}:idType = req.params as idType; 

	const tableData:FilterParams = {
		table: 'categorias',
		filter: 'id',
		filterValue: id
	};

	const selectData = await selectBy(tableData);

	return selectData;
});

app.get('/grupos', async () => {
	const tableData:SelectParams = {
		table: 'grupos',
		fields: ['id', 'grupo']
	};

	const selectData = await select(tableData);

	return selectData;
});

app.get('/tipos', async () => {
	const tableData:SelectParams = {
		table: 'tipos',
		fields: ['id', 'tipo']
	};

	const selectData = await select(tableData);

	return selectData;
});

app.get('/grupos-categorias', async () => {
	const tableData:SelectParams = {
		table: 'grupos_categorias',
		fields: ['id', 'id_grupo', 'id_categoria']
	};

	const selectData = await select(tableData);

	return selectData;
});

app.get('/entradas', async () => {
	const tableData:SelectParams = {
		table: 'entradas',
		fields: ['id', 'titulo', 'valor', 'data', 'tipo']
	};

	const selectData = await select(tableData);

	return selectData;
});

app.get('/entradas/:month', async (req) => {

	const {month}:monthType = req.params as monthType; 
	const {year}:yearType = req.query as yearType;

	const tableData:FilterByMonthParams = {
		table: 'entradas',
		year: year,
		month: month
	};

	const selectData = await selectByMonth(tableData);
	return selectData;
});

app.get('/saidas/:month', async (req) => {
	const {month}:monthType = req.params as monthType; 
	const {year}:yearType = req.query as yearType; 

	const tableData:FilterByMonthParams = {
		table: 'saidas',
		year: year,
		month: month,
	};

	const selectData = await selectByMonth(tableData);
	return selectData;
});

app.get('/saida/:id', async (req) => {

	const {id}:idType = req.params as idType; 

	const tableData:FilterParams = {
		table: 'saidas',
		filter: 'id',
		filterValue: id
	};

	const selectData = await selectBy(tableData);

	return selectData;
});

app.get('/categorias/:month/porcentagem', async (req) => {

	const {month}:monthType = req.params as monthType; 
	const {year}:yearType = req.query as yearType; 

	const tableData:FilterByMonthParams = {
		table: 'categorias',
		month: month,
		year: year,
	};

	const selectData = await selectCategoriasPercentage(tableData);
	return selectData;
});

app.get('/entradas/:month/total', async (req) => {

	const {month}:monthType = req.params as monthType; 
	const {year}:yearType = req.query as yearType; 

	const tableData:FilterByMonthParams = {
		table: 'entradas',
		year: year,
		month: month
	};

	const selectData = await sumByMonth(tableData);
	return selectData;
});

app.get('/saldo/:month/total', async (req) => {

	const {month}:monthType = req.params as monthType; 
	const {year}:yearType = req.query as yearType; 

	const tableData:FilterByMonthParams = {
		table: '',
		year: year,
		month: month
	};

	const selectData = await selectTotalSaldoByMonth(tableData);
	return selectData;
});

app.get('/saidas', async () => {
	const tableData:SelectParams = {
		table: 'saidas',
		fields: ['id', 'titulo', 'valor', 'tipo', 'categoria', 'data', 'vencimento']
	};

	const selectData = await select(tableData);

	return selectData;
});

app.post('/entradas', async (req, reply) => {

	const {titulo, valor, data, tipo}:entradaType = req.body as entradaType;
	
	const dataAtual = new Date(data);
	const dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');

	const tableData:InsertParams = {
		table: 'entradas',
		fields: ['titulo', 'valor', 'data', 'tipo'],
		values: [titulo, valor, dataFormatada, tipo]
	};

	const insertData = await insert(tableData);

	if(insertData) {
		reply.status(204).send();
	} else {
		reply.status(400).send({mensagem: "Erro ao cadastrar: Verifique os parâmetros enviados."});
	}
});

app.post('/saidas', async (req, reply) => {

	const {titulo, valor, tipo, categoria, data, vencimento, numeroMeses = 0}:saidaType = req.body as saidaType;
	
	let insertData;

	if(numeroMeses > 0) {
		for(let i = 0; i < numeroMeses; i++) {
			const dataAtual = adicionarMeses(new Date(data), i);
			const dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');
		
			const vencimentoAtual = adicionarMeses(new Date(vencimento), i);
			const vencimentoFormatado = vencimentoAtual.toISOString().slice(0, 19).replace('T', ' ');
			
			const tableData:InsertParams = {
				table: 'saidas',
				fields: ['titulo', 'valor', 'tipo', 'categoria', 'data', 'vencimento'],
				values: [titulo, valor, tipo, categoria, dataFormatada, vencimentoFormatado]
			};
		
			insertData = await insert(tableData);
		}
	} else {
		const dataAtual = new Date(data);
		const dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');
	
		const vencimentoAtual = new Date(vencimento);
		const vencimentoFormatado = vencimentoAtual.toISOString().slice(0, 19).replace('T', ' ');
		
		const tableData:InsertParams = {
			table: 'saidas',
			fields: ['titulo', 'valor', 'tipo', 'categoria', 'data', 'vencimento'],
			values: [titulo, valor, tipo, categoria, dataFormatada, vencimentoFormatado]
		};
	
		insertData = await insert(tableData);
	}


	if(insertData) {
		reply.status(204).send();
	} else {
		reply.status(400).send({mensagem: "Erro ao cadastrar: Verifique os parâmetros enviados."});
	}
});

app.put('/saidas/:id', async (req, reply) => {

	const { id } : idType = req.params as idType;
	const {titulo, valor, tipo, categoria, data, vencimento}:saidaType = req.body as saidaType;
	
	const dataAtual = new Date(data);
	const dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');

	const vencimentoAtual = new Date(vencimento);
	const vencimentoFormatado = vencimentoAtual.toISOString().slice(0, 19).replace('T', ' ');
	
	const tableData:UpdateParams = {
		id: id,
		table: 'saidas',
		fields: ['titulo', 'valor', 'tipo', 'categoria', 'data', 'vencimento'],
		values: [titulo, valor, tipo, categoria, dataFormatada, vencimentoFormatado]
	};

	const updateData = await updateById(tableData);

	if(updateData) {
		reply.status(204).send();
	} else {
		reply.status(400).send({mensagem: "Erro ao atualizar: Verifique os parâmetros enviados."});
	}
});

app.delete('/saidas/:id', async(req, reply) => {
	const { id } : idType = req.params as idType;

	const tableData:DeleteParams = {
		id: id,
		table: 'saidas'
	};

	const deleteData = await deleteById(tableData);

	if(deleteData) {
		reply.status(204).send();
	} else {
		reply.status(400).send({mensagem: "Erro ao deletar: Id não encontrado."});
	}
})

app.listen({
    port: parseInt(env.PORT as string),
	host: '0.0.0.0'
}).then(() => {
    console.log('Servidor HTTP Iniciado');
});
