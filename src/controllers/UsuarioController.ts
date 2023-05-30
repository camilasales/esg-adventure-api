import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { Log } from "../helpers/LogsHelper";
import { Op } from "sequelize";
import { limparCpfCnpj } from "../helpers/FormatHelper";
import { TipoPerfil } from "../models/TipoPerfil";
import { TipoDepartamento } from "../models/TipoDepartamento";
const excludeAttributes = {
    exclude: [
        'senha',
        'token',
        'datCadastro',
        'datAtualizacao'
    ]
};


export default class UsuarioController {

    public async listarFiltro(req: Request, res: Response) {
        try {
            const userLogado: any = req.user;

            //dados da paginação
            let current = req.body.current ? req.body.current - 1 : 0;
            let limit = req.body.limit ? req.body.limit : 5;
            let offset = current * limit;

            let wheres: any = {
                codEmpresa: userLogado.Empresa.codEmpresa
            };

            if (req.body.nome) wheres.nome = { [Op.like]: `%${req.body.nome}%` };
            if (req.body.cpf) wheres.cpf = { [Op.like]: `%${limparCpfCnpj(req.body.cpf)}%` };
            if (req.body.email) wheres.email = { [Op.like]: `%${req.body.email}%` };

            let data: any = await Usuario.findAndCountAll({
                attributes: excludeAttributes,
                limit: limit,
                offset: offset,
                where: wheres,
                order: [
                    ['datCadastro', 'DESC'],
                ],
            });

            data.pages = Math.ceil(data.count / limit);
            data.current = current + 1;
            data.previous = data.current == 1 ? null : data.current - 1;
            data.next = data.current == data.pages ? null : data.current + 1;

            res.json(data);
        } catch (error: any) {
            Log('error', 'UsuarioController', 'listarFiltro', error.message, { req: req.body, res: res.statusCode, params: req.params });

            res.status(412).json({ message: (error as Error).message });
        }
    }

    public async listar(req: Request, res: Response) {
        try {
            const userLogado: any = req.user;

            let data: any = await Usuario.findAll({
                where: { codEmpresa: userLogado.Empresa.codEmpresa },
                attributes: excludeAttributes,
            });

            res.json(data);
        } catch (error: any) {
            Log('error', 'UsuarioController', 'listar', error.message, { req: req.body, res: res.statusCode, params: req.params });

            res.status(412).json({ message: (error as Error).message });
        }
    }

    public async ver(req: Request, res: Response) {
        try {
            const userLogado: any = req.user;

            const where: any = { 
                codEmpresa: userLogado.Empresa.codEmpresa,
                codUsuario: req.params.codUsuario 
            }

            let data = await Usuario.findOne({
                where: where,
                attributes: excludeAttributes
            });

            res.json(data);
        } catch (error: any) {
            Log('error', 'UsuarioController', 'ver', error.message, { req: req.body, res: res.statusCode, params: req.params });

            res.status(412).json({ message: (error as Error).message });
        }
    }

    public async inserir(req: Request, res: Response) {
        try {
            const userLogado: any = req.user;
            const dadosUsuarioBody  = req.body;

            const tipoPerfil = await TipoPerfil.findByPk(dadosUsuarioBody.codTipoPefil);
            const tipoDepartamento = await TipoDepartamento.findByPk(dadosUsuarioBody.codTipoDepartamento);

            let body = {
                codEmpresa: userLogado.Empresa.codEmpresa,
                codTipoDepartamento: tipoDepartamento!.codTipoDepartamento,
                codTipoPerfil: tipoPerfil!.codTipoPerfil,
                nome: dadosUsuarioBody.nome,
                cpf: dadosUsuarioBody.cpf,
                email: dadosUsuarioBody.email,
                telefone: dadosUsuarioBody.telefone,
                senha: dadosUsuarioBody.senha,
                flagAtivo: true
            };

            let data = await Usuario.create(body);

            res.json({
                data: data,
                message: `Usuário ${data.nome} com o id ${data.codUsuario} criado com sucesso`
            });
        } catch (error: any) {
            Log('error', 'UsuarioController', 'inserir', error.message, { req: req.body, res: res.statusCode, params: req.params });

            res.status(412).json({ message: (error as Error).message });
        }
    }

    public async alterar(req: Request, res: Response) {
        try {
            const userLogado: any = req.user;
            const dadosUsuarioBody  = req.body;

            let where: any = { 
                codEmpresa: userLogado.Empresa.codEmpresa,
                codUsuario: req.params.codUsuario 
            };

            const usuario = await Usuario.findOne({
                where: where,
                attributes: excludeAttributes
            });

            if(!usuario) {
                throw new Error('Usuário não encontrado.')
            }

            if(dadosUsuarioBody) {
                usuario.nome = dadosUsuarioBody.nome;
                usuario.cpf = dadosUsuarioBody.cpf;
                usuario.telefone = dadosUsuarioBody.telefone;
                usuario.email = dadosUsuarioBody.email;
            }

            await usuario.save();

            delete usuario.dataValues.senha;

            res.json({
                data: usuario,
                message: `Usuário ${usuario.nome} com o id ${usuario.codUsuario} alterado com sucesso`
            });
        } catch (error: any) {
            Log('error', 'UsuarioController', 'alterar', error.message, { req: req.body, res: res.statusCode, params: req.params });

            res.status(412).json({ message: (error as Error).message });
        }
    }
}
