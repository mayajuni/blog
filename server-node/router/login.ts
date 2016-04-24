/**
 * Created by mayaj on 2016-04-24.
 */
import {Router} from "express";

let router = Router();

router.get('/', (req, res) => res.send('login'));

export = router;