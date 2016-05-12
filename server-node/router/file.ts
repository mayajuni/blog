/**
 * Created by mayaj on 2016-05-04.
 */
import {Router} from "express";
import * as multer from 'multer';

import {wrap} from "../module/error";
/* 에러시 check를 하여 next(err)을 해준다. */
import {loginCheck} from "../module/auth";

/* service */
import {FileService} from "../service/fileService";

let router = Router();

/**
 * 파일 저장
 */
router.post('/', loginCheck, multer({dest: '../uploads/'}).single('file'), wrap(async (req, res) => {
    await FileService.save(req.session.admin.userId, req.file);
    res.json(req.file);
}));

/**
 * 파일 삭제
 */
router.delete('/:_id', loginCheck, wrap(async (req, res) => {
    await FileService.remove(req.params._id);
    res.status(200).end();
}));

export = router;