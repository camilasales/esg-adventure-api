import { TipoDepartamento } from './../models/TipoDepartamento';
import { Request, Response } from "express";
import { Empresa } from "../models/Empresa";
import { Log } from "../helpers/LogsHelper";
import { Usuario } from "../models/Usuario";
import { Op, } from "sequelize";
import { TipoPerfilEnum } from "../enums/TipoPerfilEnum";
import { TipoDepartamentoEnum } from "../enums/TipoDepartamentoEnum";
import { TipoPerfil } from "../models/TipoPerfil";
import { sequelize } from "../config/database";

export default class EmpresaController {
    public async cadastrarEmpresa(req: Request, res: Response) {
        const t = await sequelize.transaction();
        try {
            const { dadosEmpresa, dadosUsuario } = req.body;

            const tipoPerfil = await TipoPerfil.findOne({
                where: {
                    nome: TipoPerfilEnum.ADMIN_EMPRESA
                }
            });

            const tipoDepartamento = await TipoDepartamento.findOne({
                where: {
                    nome: TipoDepartamentoEnum.ADMINISTRATIVO
                }
            });

            const empresaCadastrada = await Empresa.create({
                razaoSocial: dadosEmpresa.razaoSocial,
                nomeFantasia: dadosEmpresa.nomeFantasia,
                cnpj: dadosEmpresa.cnpj,
                flagAtivo: true
            }, { transaction: t });

            const usuarioCadastrado = await Usuario.create({
                codEmpresa: empresaCadastrada.codEmpresa,
                codTipoDepartamento: tipoDepartamento!.codTipoDepartamento,
                codTipoPerfil: tipoPerfil!.codTipoPerfil,
                nome: dadosUsuario.nome,
                cpf: dadosUsuario.cpf,
                email: dadosUsuario.email,
                telefone: dadosUsuario.telefone,
                senha: dadosUsuario.senha,
                flagAtivo: true
            }, { transaction: t });

            t.commit();
            res.status(200).json(dadosEmpresa);
        } catch (error :any) {
            t.rollback();
            Log('error', 'EmpresaController', 'cadastrarEmpresa', error, { req: req.body, res: res.statusCode, params: req.params });
            res.status(412).json({ message: error.message });
        }
    }

    public async verEmpresa(req: Request, res: Response) {
        try {
            const entidade = await Empresa.findOne({
                where: { codEmpresa: req.params.codEmpresa },
                include: { model: Usuario, attributes: {exclude:['senha']}, order: [ ['codUsuario', 'ASC'] ], limit: 1 }
            });

            res.status(200).json(entidade)
        } catch (error: any) {
            Log('error', 'EmpresaController', 'verEmpresa', error, { req: req.body, res: res.statusCode, params: req.params });
            res.status(412).json({ message: error });
        }
    }

}
