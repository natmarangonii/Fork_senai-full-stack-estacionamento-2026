const prisma = require("../data/prisma");
const service = require("../services/estadia.services");

const cadastrar = async (req, res) => {
    try {
        const { placa, valorHora } = req.body;

        await service.automovelExiste(placa);
        await service.automovelJaEstacionado(placa);

        const item = await prisma.estadia.create({
            data: {
                placa,
                valorHora
            }
        });

        res.status(201).json(item);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.estadia.findMany({
            include: { automovel: true }
        });

        res.status(200).json(lista);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.estadia.findUnique({
            where: { id: Number(id) },
            include: { automovel: true }
        });

        if (!item) throw new Error("Estadia não encontrada");

        res.status(200).json(item);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        const estadia = await service.validarSaida(Number(id));

        const valorTotal = service.calcularValor(
            estadia.entrada,
            estadia.valorHora
        );

        const item = await prisma.estadia.update({
            where: { id: Number(id) },
            data: {
                saida: new Date(),
                valorTotal
            }
        });

        res.status(200).json(item);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.estadia.delete({
            where: { id: Number(id) }
        });

        res.status(200).json(item);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};