/**
 * Created by mayaj on 2016-04-23.
 */
import {Logger} from './logger';

export function errorHandler (err, req, res, next) {
    /* 에러처리 */
    err.statusCode  = err.statusCode || err.status || 500;

    Logger.errorLog(`error on requst ${req.method} | ${req.url} | ${err.statusCode}`);
    Logger.errorLog(err.stack || `${err.code}  ${err.message}`);

    err.message = err.statusCode  == 500 ? 'Something bad happened.' : err.message;
    res.status(err.statusCode).send(err.message);
}

export function error(statusCode: number, message: string) {
    let err: any = new Error(message);
    err.statusCode = statusCode;
    throw err;
}