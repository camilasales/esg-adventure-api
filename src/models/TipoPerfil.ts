import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { TipoPerfilEnum } from "../enums/TipoPerfilEnum";

export class TipoPerfil extends Model {
    public readonly codTipoPerfil?: bigint;
    public nome?: string;
    public readonly datCadastro?: Date;
    public readonly datAtualizacao?: Date;
}

export interface TipoPerfilInterface {
    codTipoPerfil?: string;
    nome?: string;
}

TipoPerfil.init({
    codTipoPerfil: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'tipoPerfilUniqueIndex',
    }
}, {
    tableName: 'tipo_perfil',
    sequelize: sequelize,
    updatedAt: 'datAtualizacao',
    createdAt: 'datCadastro',
    freezeTableName: true,
    timestamps: true,
});

TipoPerfil.sync({ force: false }).then(() => {
    console.log(`tabela 'tipo perfil' criada`);

    let itens = [
        { codTipoPerfil: 1, nome: TipoPerfilEnum.ADMIN_EMPRESA },
        { codTipoPerfil: 2, nome: TipoPerfilEnum.ADMIN_DEPARTAMENTO },
        { codTipoPerfil: 3, nome: TipoPerfilEnum.FUNCIONARIO },
    ];

    TipoPerfil.bulkCreate(itens, { individualHooks: true, ignoreDuplicates: true, updateOnDuplicate: ['nome'] }).then(() => {
        console.log(`tipo de perfil cadastrado`)
    }).catch(() => console.log('tipo perfil já cadastrado'));
});

