export type SelectParams = {
	table: string;
	fields?: string[];
}

export type FilterParams = {
	table: string;
	filter: string;
	filterValue: any;
}

export type FilterByMonthParams = {
	table: string;
	year: number;
	month: number;
}

export type InsertParams = {
	table: string;
	fields: string[];
	values: any[];
}

export type UpdateParams = {
	id: number | undefined;
	table: string;
	fields: string[];
	values: any[];
}

export type DeleteParams = {
	id: number | undefined;
	table: string;
}

export type entradaType = {
	titulo: string;
	valor: number;
	data: string;
	tipo: number;
}

export type yearType = {
	year: number;
}

export type monthType = {
	month: number;
}

export type saidaType = {
	id?: number;
	titulo: string;
	valor: number;
	tipo: number;
	categoria: number;
	data: string;
	vencimento: string;
	numeroMeses: number;
}

export type idType = {
	id: number;
}