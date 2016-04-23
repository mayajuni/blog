/**
 * Created by mayaj on 2016-04-23.
 */
import { Router, Response, Request } from 'express'

let router = Router();
router.use('/api/login');

router.use((req: Request, res: Response, next: Function) => {
    let err: any = new Error('Not Foud');
    err.statusCode = 404;
    next(err);
});

export = router;