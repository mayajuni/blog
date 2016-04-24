/**
 * Created by mayaj on 2016-04-22.
 */
import * as express from "express";
import * as compression from "compression";
import * as cors from "cors";
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as Session from "express-session";
import redisStore = require("connect-redis");

/* 로그파일 저장 */
import {Logger} from './../util/logger';
import * as Router from './router';
import {errorHandler} from './error';

export class Server {
    public app: express.Application;
    private isProduction: boolean;
    constructor() {
        this.isProduction = process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production';
        //create expressjs application
        this.app = express();
        this.app.use(compression());
        this.app.use(cors());
        this.app.use(bodyParser.json());
        /* URL으로 인코딩된 부분을 해석하기 위한 옵션 extended <- 이 부분은 잘 모르겠다. */
        this.app.use(bodyParser.urlencoded({ extended: false }));
        /* 쿠키 추출 미들웨어 선언 */
        this.app.use(cookieParser());
        /* 휘발성 로그 */
        this.app.use(logger('dev'));
        /* connection Mongo */
        this.connectMongo();
        /* connection Redis Session */
        this.connectRedis();

        /* 실서버일때만 적용시킨다. */
        if(this.isProduction) {
            /* 로그를 파일로 저장 */
            this.app.use(Logger.saveLogFile);
        }
        this.app.use(Router);

        /* Not Foud */
        this.app.use((req: express.Request, res: express.Response, next: Function) => {
            let err: any = new Error('Not Foud');
            err.statusCode = 404;
            next(err);
        });

        /* 실서버일때만 적용시킨다. */
        if(this.isProduction) {
            /* 에러로그를 파일로 저장 */
            this.app.use(Logger.saveErrorLogFile);
        }

        /* 에러 핸들러 */
        this.app.use(errorHandler);
    }

    private connectMongo() {
        let connect = () => mongoose.connect(process.env.MONGO_URL);
        mongoose.connection.on('disconnected', connect);
        mongoose.connection.on('connect', () => Logger.log('mongo connected'));
        mongoose.connection.on('error', err => {
            Logger.errorLog(err);
        });
    }

    private connectRedis() {
        const RedisStore = redisStore(Session);
        this.app.use(Session({
            store: new RedisStore({
                port: process.env.REDIS_PORT,
                host: process.env.REDIS_HOST,
                pass: process.env.REDIS_PASSWORD,
                ttl: 36000
            }),
            name : process.env.SESSION_NAME,
            secret: process.env.SESSION_SECRET,
            proxy: true,
            resave : false,
            saveUninitialized : true,
            cookie: {
                secure: false
            }
        }));
    }
}