/**
 * Created by mayaj on 2016-04-23.
 */
import {Request, Response} from "express";
import {Logger} from '../util/logger';

export function errorHandler (err: any, req: Request, res: Response, next: Function) {
    /* 에러처리 */
    err.statusCode  = !err.statusCode  ? 500 : err.status;

    Logger.errorLog.error(`error on requst ${req.method} | ${req.url} | ${err.statusCode}`);
    Logger.errorLog.error(err.stack);

    err.message = err.statusCode  == 500 ? 'Something bad happened.' : err.message;
    res.status(err.statusCode ).send(err.message);
}