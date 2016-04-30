/**
 * Created by mayaj on 2016-04-24.
 */
import {Router} from "express";
import johayoPvs = require("johayo-pvs");

/* 에러시 check를 하여 next(err)을 해준다. */
import {wrap} from "../module/error";
import {loginCheck} from "../module/auth";



/* service */
import {BoardService} from "../service/boardService";

let router = Router();

export = router;