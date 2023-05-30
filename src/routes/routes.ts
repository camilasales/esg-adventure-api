import AuthController from '../controllers/AuthController';
import { IndexController } from '../controllers/IndexController';
import UsuarioController from '../controllers/UsuarioController';
import EmpresaController from '../controllers/EmpresaController';

import UsuarioValidator from "../validators/UsuarioValidator";

import authMiddleware from '../middlewares/auth.middleware';

export class Routes {
    constructor() {
    }

    public routes(app: any): void {

        //Index
        const indexController = new IndexController()
        app.get('/', indexController.get);

        //Auth
        const authController = new AuthController();
        app.get("/auth", authController.getUser);
        app.post("/auth/login", authController.login);
        app.use(authMiddleware.authenticate());

        //Usuário
        const usuarioController = new UsuarioController();
        const usuarioValidator = new UsuarioValidator();
        app.post("/usuario/listar-filtro", usuarioController.listarFiltro);
        app.get("/usuario", usuarioController.listar);
        app.get("/usuario/:codUsuario", usuarioController.ver);
        app.post("/usuario", [usuarioValidator.validarUsuarioCadastrar], usuarioController.inserir);
        app.put("/usuario/:codUsuario", [usuarioValidator.validarUsuarioAlterar], usuarioController.alterar);

        //Empresa
        const empresaController = new EmpresaController();
        app.get("/empresa/:codEmpresa", empresaController.verEmpresa);
    }
}
