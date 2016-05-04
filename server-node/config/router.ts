/**
 * Created by mayaj on 2016-04-23.
 */
import * as login from '../router/login';
import * as bookmark from '../router/bookmark';
import * as board from '../router/board';
import * as menu from '../router/menu';
import * as file from '../router/file';

export function Router(app) {
    /* 로그인 */
    app.use('/api/login', login);
    /* 북마크 */
    app.use('/api/bookmark', bookmark);
    /* 게시판 */
    app.use('/api/board', board);
    /* 메뉴 */
    app.use('/api/menu', menu);
    /* 파일 */
    app.use('/api/file', file);
}