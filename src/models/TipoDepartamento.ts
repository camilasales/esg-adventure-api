import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { TipoDepartamentoEnum } from "../enums/TipoDepartamentoEnum";

export class TipoDepartamento extends Model {
    public readonly codTipoDepartamento?: bigint;
    public nome?: string;
    public readonly datCadastro?: Date;
    public readonly datAtualizacao?: Date;
}

export interface TipoDepartamentoInterface {
    codTipoDepartamento?: string;
    nome?: string;
}

TipoDepartamento.init({
    codTipoDepartamento: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'TipoDepartamentoUniqueIndex',
    }
}, {
    tableName: 'tipo_departamento',
    sequelize: sequelize,
    updatedAt: 'datAtualizacao',
    createdAt: 'datCadastro',
    freezeTableName: true,
    timestamps: true,
});

TipoDepartamento.sync({ force: false }).then(() => {
    console.log(`tabela 'tipo departamento' criada`);

    let itens = [
        { codTipoDepartamento: 1, nome: TipoDepartamentoEnum.ADMINISTRATIVO },
        { codTipoDepartamento: 2, nome: TipoDepartamentoEnum.COMERCIAL },
        { codTipoDepartamento: 3, nome: TipoDepartamentoEnum.FINANCEIRO },
        { codTipoDepartamento: 4, nome: TipoDepartamentoEnum.MARKETING },
        { codTipoDepartamento: 5, nome: TipoDepartamentoEnum.OPERACIONAL },
        { codTipoDepartamento: 6, nome: TipoDepartamentoEnum.RECURSOS_HUMANOS },
    ];

    TipoDepartamento.bulkCreate(itens, { individualHooks: true, ignoreDuplicates: true, updateOnDuplicate: ['nome'] }).then(() => {
        console.log(`tipo de departamento cadastrado`)
    }).catch(() => console.log('tipo departamento já cadastrado'));
});

