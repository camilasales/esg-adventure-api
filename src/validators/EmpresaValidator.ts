import { Empresa } from './../models/Empresa';
import { NextFunction, Request, Response } from "express";
import { validaCpfCnpj } from "../helpers/ValidatorHelper";
import { Usuario } from "../models/Usuario";
import { Log } from "../helpers/LogsHelper";
import { Op } from "sequelize";


export default class EmpresaValidator {
    public async validarEmpresaCadastrar(req: Request, res: Response, next: NextFunction) {
        try {
            const userLogado: any = req.user;
            const {dadosEmpresa, dadosUsuario} = req.body;

            // valida dados empresa
            if(!dadosEmpresa){
                throw new Error('Dados da empresa não informados.');
            }

            if(!dadosEmpresa.razaoSocial) {
                throw new Error('Razao Social não informado.');
            }

            if(!dadosEmpresa.nomeFantasia) {
                throw new Error('Nome Fantasia não informado.');
            }

            if(!validaCpfCnpj(dadosEmpresa.cnpj)) {
                throw new Error('CNPJ inválido');
            }

            const cnpj = await Empresa.findOne({ 
                where: { cnpj: dadosEmpresa.cnpj}
            });

            if(cnpj) {
                throw new Error('Este CNPJ já foi cadastrado.');
            }


            // valida dados usuario
            if(!dadosUsuario){
                throw new Error('Dados do usuário não informados.');
            }
            
            if(!dadosUsuario.codTipoDepartamento) {
                throw new Error('Tipo de departamento não informado');
            }

            if(!dadosUsuario.codTipoPefil) {
                throw new Error('Tipo de perfil não informado.');
            }

            if(!dadosUsuario.nome) {
                throw new Error('Nome não informado.');
            }

            if(!dadosUsuario.telefone) {
                throw new Error('Telefone não informado.');
            }

            if(!dadosUsuario.cpf) {
                throw new Error('CPF não informado.');
            }

            if(!validaCpfCnpj(dadosUsuario.cpf)) {
                throw new Error('CPF inválido');
            }

            const cpf = await Usuario.findOne({ 
                where: { cpf: dadosUsuario.cpf}
            });

            if(cpf) {
                throw new Error('Este CPF já foi cadastrado.');
            }

            if(!dadosUsuario.email) {
                throw new Error('E-mail não informado');
            }

            const email = await Usuario.findOne({ 
                where: { cpf: dadosUsuario.email}
            });

            if(email) {
                throw new Error('Este E-mail já foi cadastrado.');
            }


            if(!dadosUsuario.telefone) {
                throw new Error('Telefone não informado');
            }

            if(!dadosUsuario.senha) {
                throw new Error('Senha não informada');
            }

            if(!dadosUsuario.confirmacaoSenha) {
                throw new Error('Confirmação de senha não informada');
            }

            if(dadosUsuario.senha != dadosUsuario.confirmacaoSenha) {
                throw new Error('As senhas não conferem.');
            }

            next();
        } catch (error: any) {
            Log('error', 'EmpresaValidator', 'validarEmpresa', error.message, { req: req.body, res: res.statusCode, params: req.params });
            res.status(412).json({ message: (error as Error).message });
        }

    };

    public async validarEmpresaAlterar(req: Request, res: Response, next: NextFunction) {
        try {
            const empresa = await Empresa.findOne({ where: { codEmpresa: req.params.codEmpresa }});

            if(!empresa) {
                throw new Error('Empresa não encontrado.');
            }

            next();
        } catch (error: any) {
            console.log(error)
            Log('error', 'EmpresaValidator', 'validarEmpresa', error.message, { req: req.body, res: res.statusCode, params: req.params });
            res.status(412).json({ message: (error as Error).message });
        }
    };

}
