import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import bcrypt from "bcrypt";
import { Empresa } from "./Empresa";
import { TipoPerfil } from "./TipoPerfil";
import { TipoDepartamento } from "./TipoDepartamento";

export class Usuario extends Model {
    public readonly codUsuario?: bigint;
    public codEmpresa?: bigint;
    public codTipoDepartamento?: bigint;
    public codTipoPerfil?: bigint;
    public nome?: string;
    public cpf?: string;
    public email?: string;
    public telefone?: string;
    public senha?: string;
    public token?: string;
    public flagAtivo?: number;
    public readonly datCadastro?: Date;
    public readonly datAtualizacao?: Date;
}

export interface UsuarioInterface {
    codUsuario?: bigint;
    codEmpresa?: bigint;
    codTipoDepartamento?: bigint;
    codTipoPerfil?: bigint;
    nome?: string;
    cpf?: string;
    email?: string;
    telefone?: string;
    senha?: string;
    token?: string;
    flagAtivo?: number;
}

Usuario.init({
    codUsuario: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    codEmpresa: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    codTipoDepartamento: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    codTipoPerfil: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: "cpfUniqueIndex",
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "emailUniqueIndex",
    },
    telefone: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    senha: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    flagAtivo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'usuario',
    sequelize: sequelize,
    updatedAt: 'datAtualizacao',
    createdAt: 'datCadastro',
    freezeTableName: true,
    timestamps: true,
    hooks: {
        beforeValidate: (data) => {

            if(data.cpf) {
                data.cpf = data.cpf.replace('.', '').replace('-', '').replace('/', '');
            }

            if(data.telefone) {
                data.telefone = data.telefone
                    .replace('(', '')
                    .replace(')', '')
                    .replace('-', '')
                    .replace(' ', '');
            }
        },
        beforeCreate: (data) => {
            if (data.senha) {
                data.senha = criptografarSenha(data.senha);
            }
        },
        beforeUpdate: (data) => {
            if (data.senha) {
                data.senha = criptografarSenha(data.senha);
            }
        },
    }
});

Usuario.sync({ force: false }).then(() => {
    Usuario.belongsTo(Empresa, {
        foreignKey: 'codEmpresa',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Usuario.belongsTo(TipoDepartamento, {
        foreignKey: 'codTipoDepartamento',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });

    Usuario.belongsTo(TipoPerfil, {
        foreignKey: 'codTipoPerfil',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
    
    let data = [
        {
            codUsuario: 1,
            codEmpresa: 1,
            codTipoDepartamento: 1,
            codTipoPerfil: 1,
            nome: 'Empresa Teste Admin',
            cpf: '00000000000',
            telefone: '0000000000',
            email: 'empresa.teste@gmail.com.br',
            senha: 'S123456',
            flagAtivo: true
        }
    ];

    Usuario.bulkCreate(data, { individualHooks: true, ignoreDuplicates: true, validate: true }).then(() => {
        console.log(`'usuario-admin' criado`);
    }).catch((e) => {
        console.log(`usuário-admin já foi criado`);
    });

    console.log(`tabela 'usuario' criada`);
});

function criptografarSenha(senha: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(senha.toString(), salt);
}
