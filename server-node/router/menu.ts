/**
 * Created by mayaj on 2016-04-24.
 */
import {Router} from "express";
import {MenuService} from "../service/menuService";
import johayoPvs = require("johayo-pvs");

import {wrap} from "../module/error";
/* 에러시 check를 하여 next(err)을 해준다. */
import {loginCheck} from "../module/auth";

/* 변수 체크 */
const VO = new johayoPvs({
    _id: {type: String, validate: {method: 'PUT, DELETE'}},
    name: {type: String, validate: {method: 'POST'}},
    nickName: {type: String, validate: {method: 'PUT, POST'}},
    url: {type: String, validate: {method: 'PUT, POST'}},
    rank: {type: Number, validate: {method: 'PUT'}}
});
VO.setParams = (req, res, next) => {
    VO.set(req, res, next);
};

let router = Router();

/**
 * 메뉴 가져오기
 */
router.get('/', wrap(async (req, res) => {
    const menus = await MenuService.get();
    res.send(menus);
}));

/**
 * 메뉴 저장
 */
router.post('/', loginCheck, VO.setParams, wrap(async (req, res) => {
    const menu = await MenuService.save(req.session.admin.userId, VO.get);
    res.send(menu);
}));

/**
 * 메뉴 수정
 */
router.put('/', loginCheck, VO.setParams, wrap(async (req, res) => {
    await MenuService.put(req.session.admin.userId, VO.get);
    res.status(200).end();
}));

/**
 * 메뉴 삭제
 */
router.delete('/:_id', loginCheck, wrap(async (req, res) => {
    await MenuService.remove(req.session.admin.userId, req.params._id);
    res.status(200).end();
}));

/**
 * step2 메뉴 저장
 */
router.post('/step2/:_step1Id', loginCheck, VO.setParams, wrap(async (req, res) => {
    await MenuService.step2Save(req.session.admin.userId, req.params._step1Id, VO.get);
    res.status(200).end();
}));

/**
 * step2 메뉴 수정
 */
router.put('/step2/:_step1Id', loginCheck, VO.setParams, wrap(async (req, res) => {
    await MenuService.step2Put(req.session.admin.userId, req.params._step1Id, VO.get);
    res.status(200).end();
}));

/**
 * step2 메뉴 삭제
 */
router.delete('/step2/:_id', loginCheck, wrap(async (req, res) => {
    await MenuService.step2Remove(req.session.admin.userId, req.params._id);
    res.status(200).end();
}));

export = router;