/**
 * Created by mayaj on 2016-04-23.
 */
import {Logger} from './logger';

export function errorHandler (err, req, res, next) {
    /* 에러처리 */
    err.status  = err.status || 500;

    Logger.errorLog(`error on requst ${req.method} | ${req.url} | ${err.status}`);
    Logger.errorLog(err.stack || `${err.code}  ${err.message}`);

    err.message = err.status  == 500 ? 'Something bad happened.' : err.message;
    res.status(err.status).send(err.message);
}

export function error(status: number, message: string) {
    let err: any = new Error(message);
    err.status = status;
    throw err;
}

export let wrap = fn => (req, res, next) => fn(req, res, next).catch(next);