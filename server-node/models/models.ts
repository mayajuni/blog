/**
 * Created by mayaj on 2016-04-25.
 */
import * as mongoose from 'mongoose';

/**
 * mongo model 모듈
 */
export module Models {
    let Schema = mongoose.Schema;

    /* 관리자 */
    export let admin = mongoose.model('admin', new Schema({
        _id: String,
        password: String,
        name: String,
        token: String,
        regDt: {type: Date, default: Date.now}
    }));

    /* 메뉴 */
    const menuSchema = new Schema({
        name: {type: String, unique: true},
        nickName: String,
        url: String,
        api: String,
        rank: Number,
        userId: String,
        regDt: {type: Date, default: Date.now}
    });
    export let menu = mongoose.model('menu', new Schema({
        name: {type: String, unique: true},
        nickName: String,
        url: String,
        api: String,
        rank: Number,
        subMenus: menuSchema,
        userId: String,
        regDt: {type: Date, default: Date.now}
    }));

    /* 게시판 */
    export let board = mongoose.model('board',  new Schema({
        _menuId: Schema.Types.ObjectId,
        userId: String,
        title: String,
        content: String,
        hasTag: [String],
        files: [],
        regDt: {type: Date, default: Date.now}
    }));

    /* 북마크 */
    export let bookmark = mongoose.model('bookmark', new Schema({
        userId: String,
        title: String,
        memo: String,
        tags: [String],
        url: String,
        imgUrl: String,
        regDt: {type: Date, default: Date.now}
    }));

    /* 웹로그 수집 - 클라이언트로그 */
    export let webLog = mongoose.model('web_log', new Schema({
        _menuId: Schema.Types.ObjectId,
        menuName: String,
        url: String,
        host: String,
        sessionID: String,
        os: String,
        os_vers: String,
        user_agent: String,
        browser: String,
        is_mobile: String,
        screen_width: String,
        screen_height: String,
        ip: String,
        regDt: {type:Date, default: Date.now}
    }));
}

