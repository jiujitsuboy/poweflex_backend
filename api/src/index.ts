import express, { Request, Response, NextFunction } from "express"
import routerFactory from "./routes/factory";
import routerSpRocket from "./routes/sprocket";
import routerSpRocketProduction from "./routes/sprocketProduction";
import 'json-bigint-patch'


const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(routerFactory)
server.use(routerSpRocket)
server.use(routerSpRocketProduction)


server.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ errors: [{ message: message, data: data }] });
});

server.listen(5000, () => {
    console.log("express server up....");
});