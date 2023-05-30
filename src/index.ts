import app from "./config/app";
import { environments } from './config/environments';
import cluster from "cluster";
import os from "os";

const port = environments.api_port;

if (environments.env === 'local') {
    app.listen(port, () => console.log(`[${environments.env}] ${environments.app_name} ${environments.api_version} - funcionando na porta ${port}`));
} else {
    const CPUS = os.cpus();

    if (cluster.isMaster) {
        CPUS.forEach(() => cluster.fork());

        cluster.on("listening", worker => {
            console.log("Cluster %d conectado", worker.process.pid);
        });
        cluster.on("disconnect", worker => {
            console.log("Cluster %d desconectado", worker.process.pid);
        });
        cluster.on("exit", worker => {
            console.log("Cluster %d saiu do ar", worker.process.pid);
            cluster.fork();
        });
    } else {
        const port = environments.api_port;

        app.listen(port, () => console.log(`[${environments.env}] ${environments.app_name} ${environments.api_version} - funcionando na porta ${port}`));

        console.log(`Worker ${process.pid} iniciou.`);
    }
}