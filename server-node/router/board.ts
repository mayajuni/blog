/**
 * Created by mayaj on 2016-04-24.
 */
import {Router} from "express";
const johayoPvs = require("johayo-pvs");

import {wrap} from "../module/error";
/* 에러시 check를 하여 next(err)을 해준다. */
import {loginCheck} from "../module/auth";

/* service */
import {BoardService} from "../service/boardService";

let router = Router();

/* 변수 체크 */
const VO = new johayoPvs({
    _id: {type: String, validate: {method: 'PUT, DELETE'}},
    _menuId: {type: String, validate: {method: 'PUT, POST'}},
    title: {type: String, validate: {method: 'PUT, POST'}},
    content: {type: String, validate: {method: 'PUT, POST'}},
    tags: {type: Array, validate: {method: 'PUT, POST'}},
    files:  Array,
    page: {type: Number, default: 1},
    view: {type: Number, default: 15}
});
VO.setParams = (req, res, next) => {
    VO.set(req, res, next);
};

/**
 * 테스트 파일 저장
 */
router.post('/test', wrap(async (req, res) => {
    const result = await BoardService.saveTest();
    res.send(result);
}));

/**
 * 테스트 파일 삭제
 */
router.delete('/test', wrap(async (req, res) => {
    await BoardService.removeTest();
    res.status(200).end();
}));

/**
 * 리스트
 */
router.get('/', VO.setParams, wrap(async (req, res) => {
    const boards = await BoardService.get(VO.get._menuId, VO.get.title, VO.get.page, VO.get.view);
    res.send(boards);
}));

/**
 * 리스트
 */
router.get('/:_id', wrap(async (req, res) => {
    const board = await BoardService.getDetail(req.params._id);
    res.send(board);
}));

/**
 * 저장
 */
router.post('/', loginCheck, VO.setParams, wrap(async (req, res) => {
    const result = await BoardService.save(req.session.admin.userId, VO.get);
    res.send(result);
}));

/**
 * 수정
 */
router.put('/', loginCheck, VO.setParams, wrap(async (req, res) => {
    await BoardService.put(req.session.admin.userId, VO.get);
    res.status(200).end();
}));

/**
 * 삭제
 */
router.delete('/:_id', loginCheck, wrap(async (req, res) => {
    await BoardService.remove(req.session.admin.userId, req.params._id);
    res.status(200).end();
}));

export = router;