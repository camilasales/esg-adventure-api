import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { Usuario } from "./Usuario";


export class Empresa extends Model {
    public codEmpresa?: bigint;
    public razaoSocial?: string;
    public nomeFantasia?: string;
    public cnpj?: string;
    public flagAtivo?: boolean;
    public readonly datCadastro?: Date;
    public readonly datAtualizacao?: Date;
}

export interface EmpresaInterface {
    codEmpresa?: bigint;
    razaoSocial?: string;
    nomeFantasia?: string;
    cnpj?: string;
    flagAtivo?: boolean;
}

Empresa.init({
    codEmpresa: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    razaoSocial: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nomeFantasia: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    cnpj: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: 'EmpresaUniqueIndex'
    },
    flagAtivo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    }
}, {
    tableName: 'Empresa',
    sequelize: sequelize,
    paranoid: true,
    updatedAt: 'datAtualizacao',
    createdAt: 'datCadastro',
    freezeTableName: true,
    timestamps: true,
    hooks: {
        beforeValidate: (data, options) => {
            data.cnpj = data.cnpj?.replace('.', '').replace('-', '').replace('/', '');
        },
    }
});

Empresa.sync({ force: false }).then(() => {
    Empresa.hasMany(Usuario, { foreignKey: 'codEmpresa' });

    Empresa.bulkCreate([
        {
            codEmpresa: 1,
            razaoSocial: 'Empresa Teste S/A',
            nomeFantasia: 'Empresa Teste',
            cnpj: '19011529000139',
        }
    ], { individualHooks: true, ignoreDuplicates: true, updateOnDuplicate: ['cnpj'] }).then(() => {
        console.log(`Empresa Teste criada`);
    }).catch(() => {
        console.log(`Empresa Teste já foi criada`);
    });

    console.log(`tabela 'Empresa' criada`);

});
