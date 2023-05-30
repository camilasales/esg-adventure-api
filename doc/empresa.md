### Empresa

---
> Inserir
> 
POST - http://localhost:3000/empresa

```json
{
	"dadosEmpresa":{
		"razaoSocial": "Nova Empres LTDA",
		"nomeFantasia": "Nova Empresa Nome Fantasia",
		"cnpj": "61.197.180/0001-38"
	},
	"dadosUsuario":{
		"codTipoDepartamento": 1,
		"codTipoPefil": 1,
		"nome": "usuario teste 2",
		"cpf": "570.819.220-82",
		"email": "usuario.teste@gmail.com.br",
		"telefone": "11888888888",
		"senha": "S123456",
		"confirmacaoSenha": "S123456"
	}
}
```
-------------------------------------------------------------

> Ver
> 
GET - http://localhost:3000/empresa/1
