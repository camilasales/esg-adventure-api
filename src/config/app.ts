import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { Routes } from '../routes/routes';

import { logs } from '../middlewares/logs.middleware';
import fs from 'fs';
import session from 'express-session';
import { environments } from './environments';

class App {
    public app: express.Application;
    public route: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.middlewares();
        this.route.routes(this.app);
        this.setViewEngine();

        this.createFolders('./logs');
        this.createFolders('./private');
        this.createFolders('./public');
    }

    private config(): void {
        this.app.use(
            express.json({
                limit: '10mb',
            })
        );
        this.app.use(
            express.urlencoded({
                limit: '10mb',
                extended: false,
            })
        );
        
        let secret: any = environments.jwt_secret;
        this.app.use(session({ secret: secret }));

        this.app.use(compression());
        this.app.use(cors());
        this.app.use(helmet());
    }

    private middlewares(): void {
        this.app.use(logs);
    }

    private setViewEngine() {
        this.app.use(express.static(__dirname + '/../assets/'));
    }

    private createFolders(pathFolder: string) {
        if (!fs.existsSync(pathFolder)) {
            fs.mkdir(pathFolder, { recursive: true }, (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log(`Diretório ${pathFolder} criado com sucesso`);
            });
        }
    }
}

export default new App().app
