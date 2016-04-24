/**
 * Created by mayaj on 2016-04-23.
 */
import {Logger} from '../module/logger';

export function errorHandler (err, req, res, next) {
    /* 에러처리 */
    err.statusCode  = err.statusCode || 500;

    Logger.errorLog(`error on requst ${req.method} | ${req.url} | ${err.statusCode}`);
    Logger.errorLog(err.stack);

    err.message = err.statusCode  == 500 ? 'Something bad happened.' : err.message;
    res.status(err.statusCode).send(err.message);
}