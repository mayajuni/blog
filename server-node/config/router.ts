/**
 * Created by mayaj on 2016-04-23.
 */
import { Router } from 'express'

let router = Router();
router.use('/index', (req, res) => {
    res.send('hollow world');
});

export = router;