### Usuario

---
> Inserir
> 
POST - http://localhost:3000/usuario

```json
{
	"codTipoDepartamento": 1,
	"codTipoPefil": 1,
	"nome": "Novo usuario",
	"cpf": "336.129.430-49",
	"email": "usuario2@gmail.com",
	"telefone": "11999999999",
	"senha": "S123456",
	"confirmacaoSenha": "S123456"
}
```

-------------------------------------------------------------
> Ver
> 
GET - http://localhost:3000/usuario/1


-------------------------------------------------------------
> Listar Filtro
> 
POST - http://localhost:3000/usuario/listar-filtro

```json
{
	"nome":"",
	"cpf": "",
	"email": "",
	"current": 1
}
```