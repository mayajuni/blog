/**
 * Created by mayaj on 2016-04-23.
 */
import * as login from '../router/login';

export function Router(app) {
    /* 로그인전 */
    app.use('/api/login', login);

    /* 로그인 체크 */

    
    /* 로그인후 */

}