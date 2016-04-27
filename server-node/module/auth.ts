/**
 * Created by mayaj on 2016-04-27.
 */

export function loginCheck(req, res, next) {
    if(!req.session.admin) {
        let err: any = new Error('로그인이 필요합니다.');
        err.statusCode = 401;
        next(err);
    }else{
        next();
    }
}