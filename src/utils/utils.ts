export function adicionarMeses(data: Date, meses: number) {
    const dataAtual = new Date(data);
    
    dataAtual.setMonth(dataAtual.getMonth() + meses);

    return dataAtual;
}
