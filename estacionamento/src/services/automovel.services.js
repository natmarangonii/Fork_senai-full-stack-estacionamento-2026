const prisma = require("../data/prisma");

const placaDuplicada = async (placa) => {
    const existente = await prisma.automovel.findUnique({
        where: { placa }
    });

    if (existente) {
        throw new Error("Já existe um automóvel com essa placa");
    }
};


const automovelExiste = async (placa) => {
    const automovel = await prisma.automovel.findMany({
        where: { placa }
    });

    if (!automovel) {
        throw new Error("Automóvel não encontrado");
    }

    return automovel;
};

const podeExcluirAutomovel = async (placa) => {
    const estadia = await prisma.estadia.findFirst({
        where: {
            placa,
            saida: null
        }
    });

    if (estadia) {
        throw new Error("Automóvel possui estadia ativa");
    }
};

module.exports = {
    placaDuplicada,
    automovelExiste,
    podeExcluirAutomovel
};