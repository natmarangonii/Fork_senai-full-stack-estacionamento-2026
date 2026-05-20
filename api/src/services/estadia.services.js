const prisma = require("../data/prisma");

const automovelJaEstacionado = async (placa) => {
    const existente = await prisma.estadia.findFirst({
        where: {
            placa,
            saida: null
        }
    });

    if (existente) {
        throw new Error("Automóvel já estacionado");
    }
};

const automovelExiste = async (placa) => {
    const automovel = await prisma.automovel.findMany({
        where: { placa: placa }
    });

    if (!automovel) {
        throw new Error("Automóvel não encontrado");
    }
};

const validarSaida = async (id) => {
    const estadia = await prisma.estadia.findUnique({
        where: { id }
    });

    if (!estadia) {
        throw new Error("Estadia não encontrada");
    }

    if (estadia.saida) {
        throw new Error("Estadia já finalizada");
    }

    return estadia;
};

const calcularValor = (entrada, valorHora) => {
    const agora = new Date();
    const diff = agora - new Date(entrada);
    const horas = diff / (1000 * 60 * 60);

    return Number((horas * valorHora).toFixed(2));
};


module.exports = {
    automovelExiste,
    automovelJaEstacionado,
    validarSaida,
    calcularValor
};