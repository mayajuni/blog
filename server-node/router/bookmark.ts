/**
 * Created by mayaj on 2016-04-24.
 */
import {Router} from "express";
import johayoPvs = require("johayo-pvs");

/* 에러시 check를 하여 next(err)을 해준다. */
import {wrap} from "../module/error";
import {loginCheck} from "../module/auth";

/* service */
import {BookmarkService} from "../service/bookmarkService";

let router = Router();

/* 변수 체크 */
const VO = new johayoPvs({
    _id: {type: String, validate: {method: 'put, delete'}},
    title: {type: String, validate: {method: 'put, post'}},
    memo: String,
    tags: {type: Array, validate: {method: 'put, post'}},
    url:  {type: String, validate: {method: 'put, post'}},
    imgUrl: String,
});
VO.setParams = (req, res, next) => {
    VO.set(req, res, next);
};

/**
 * 가져오기
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
    await BookmarkService.save(req.session.admin.userId, VO.get);
    res.status(200).end();
}));

/**
 * 수정하기
 */
router.put('/:_id', loginCheck, VO.setParams, wrap(async (req, res) => {
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