/**
 * Created by mayaj on 2016-04-22.
 */
import * as winston from 'winston';
import * as moment from 'moment';

export module Logger {
    export let errorLog = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                level: 'error'
            })
        ]
    });
    let infoFileLog = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                name: 'info-file',
                filename: 'logs/server/' +moment().format("YYYY-MM-DD") + '.log',
                level: 'info'
            })
        ]
    });    
    let errorFileLog = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                name: 'info-file',
                filename: 'logs/error/' +moment().format("YYYY-MM-DD") + '.log',
                level: 'error'
            })
        ]
    });

    /**
     * 파일 저장(정상)
     * 
     * @param req
     * @param res
     * @param next
     */
    export function saveLogFile(req, res, next) {
        if(res.statusCode <= 400) {
            let meta: any = {
                ip:  req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                req: {},
                res: {}
            };

            const end = res.end;
            res.end = (chunk, encoding) => {
                res.end = end;
                res.end(chunk, encoding);

                meta.req.url = req.originalUrl || req.url;
                meta.req.method = req.method;
                meta.req.httpVersion = req.httpVersion;
                meta.req.query = req.query || '';
                meta.req.params = req.params || '';
                meta.req.body = req.body || '';
                meta.req['accept-language'] = req.headers['accept-language'];
                meta.req['accept-language'] = req.headers['user-agent'];
                meta.responseTime = res.responseTime;
                if (chunk) {
                    var isJson = (res._headers && res._headers['content-type']
                    && res._headers['content-type'].indexOf('json') >= 0);
                    meta.res.body =  isJson ? JSON.parse(chunk) : chunk.toString();
                }
                meta.res.statusCode = res.statusCode;

                infoFileLog.log('info', '', meta)
            };
        }

        next();
    }

    /**
     * 파일 저장(에러일때)
     * 
     * @param err
     * @param req
     * @param res
     * @param next
     */
    export function saveErrorLogFile(err, req, res, next) {
        if(res.statusCode >= 400) {
            let meta: any = {
                ip:  req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                req: {},
                res: {}
            };

            meta.req.url = req.originalUrl || req.url;
            meta.req.method = req.method;
            meta.req.httpVersion = req.httpVersion;
            meta.req.query = req.query || '';
            meta.req.params = req.params || '';
            meta.req.body = req.body || '';
            meta.req['accept-language'] = req.headers['accept-language'];
            meta.req['accept-language'] = req.headers['user-agent'];
            meta.responseTime = res.responseTime;
            meta.res.statusCode = res.statusCode;
            meta.error = err;

            errorFileLog.log('error', '', meta);
        }

        next();
    }
}