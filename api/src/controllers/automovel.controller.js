const prisma = require("../data/prisma");
const service = require("../services/automovel.services");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;

        await service.placaDuplicada(data.placa);

        const item = await prisma.automovel.create({ data });

        res.status(201).json(item);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.automovel.findMany({
            include: { estadias: true }
        });

        res.status(200).json(lista);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const buscar = async (req, res) => {
    try {
        const { placa } = req.params;

        const item = await service.automovelExiste(placa);

        res.status(200).json(item);
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
};

const atualizar = async (req, res) => {
    try {
        const { placa } = req.params;

        await service.automovelExiste(placa);

        const item = await prisma.automovel.update({
            where: { placa },
            data: req.body
        });

        res.status(200).json(item);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const excluir = async (req, res) => {
    try {
        const { placa } = req.params;

        await service.automovelExiste(placa);
        await service.podeExcluirAutomovel(placa);

        const item = await prisma.automovel.delete({
            where: { placa }
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