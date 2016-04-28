/**
 * Created by mayaj on 2016-04-27.
 */

export function loginCheck(req, res, next) {
    if(!req.session.admin) {
        let err: any = new Error('need_login');
        err.statusCode = 401;
        next(err);
    }else{
        next();
    }
}