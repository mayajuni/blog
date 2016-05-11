/**
 * Created by mayaj on 2016-04-24.
 */
import {Router} from "express";
const johayoPvs = require("johayo-pvs");

import {wrap} from "../module/error";
/* 에러시 check를 하여 next(err)을 해준다. */
import {loginCheck} from "../module/auth";

/* service */
import {BookmarkService} from "../service/bookmarkService";

let router = Router();

/* 변수 체크 */
const VO = new johayoPvs({
    _id: {type: String, validate: {method: 'PUT, DELETE'}},
    title: {type: String, validate: {method: 'PUT, POST'}},
    memo: String,
    tags: {type: Array, validate: {method: 'PUT, POST'}},
    url:  {type: String, validate: {method: 'PUT, POST'}},
    imgUrl: String,
});
VO.setParams = (req, res, next) => {
    VO.set(req, res, next);
};

/**
 * 테스트 파일 저장
 */
router.post('/test', wrap(async (req, res) => {
    const result = await BookmarkService.saveTest();
    res.send(result);
}));

/**
 * 테스트 파일 삭제
 */
router.delete('/test', wrap(async (req, res) => {
    await BookmarkService.removeTest();
    res.status(200).end();
}));

/**
 * 리스트
 */
router.get('/', VO.setParams, wrap(async (req, res) => {
    const bookmarks = await BookmarkService.get(VO.get.tags);
    res.send(bookmarks);
}));

/**
 * URL 정보를 가져온다
 */
router.get('/getUrlInfo/:url', loginCheck, wrap(async (req, res) => {
    const urlInfo = await BookmarkService.getUrlInfo(req.params.url);
    res.json(urlInfo);
}));

/**
 * 저장하기
 */
router.post('/', loginCheck, VO.setParams, wrap(async (req, res) => {
    const result = await BookmarkService.save(req.session.admin.userId, VO.get);
    res.json(result);
}));

/**
 * 수정하기
 */
router.put('/', loginCheck, VO.setParams, wrap(async (req, res) => {
    await BookmarkService.put(req.session.admin.userId, VO.get);
    res.status(200).end();
}));

/**
 * 삭제하기
 */
router.delete('/:_id', loginCheck, wrap(async (req, res) => {
    await BookmarkService.remove(req.session.admin.userId, req.params._id);
    res.status(200).end();
}));

export = router;