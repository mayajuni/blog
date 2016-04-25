/**
 * Created by mayaj on 2016-04-24.
 */
import {Router} from "express";
import {LoginService} from "../service/loginService";
import johayoPvs = require("johayo-pvs");

let wrap = fn => (req, res, next) => fn(req, res, next).catch(next);
let router = Router();
/* 변수 체크 */
const loginVO = new johayoPvs({
    userId: {type: String, validate: {checkURL: ['!/api/login/token']}},
    password: {type: String, validate: {checkURL: ['/api/login']}},
    token: {type:String, validate: {checkURL: ['/api/login/token']}}
});
loginVO.setParams = (req, res, next) => {
    loginVO.set(req, res, next);
};

/**
 * 로그인 하기
 */
router.post('/', loginVO.setParams, wrap(async function(req, res) {
    const admin = await LoginService.login(loginVO.get.userId, loginVO.get.password);
    req.session.admin = admin;
    res.send(admin);
}));

/**
 * 로그인 정보 주기
 */
router.get('/', (req, res) => {
    res.send(req.session['admin']);
});

/**
 * 로그인 정보 주기
 */
router.post('/token', loginVO.setParams, wrap(async (req, res) => {
    const admin = await LoginService.tokenLogin(loginVO.get.token);
    req.session.admin = admin;
    res.send(admin);
}));

export = router;