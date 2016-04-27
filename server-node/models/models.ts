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

    /* 메뉴 - 메뉴 스키마는 서브 메뉴에서 또 쓰이기때문에 밖으로 뺐다. */
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

    /* 파일 - 파일 스키마는 board 스키마에서 쓰이기 때문에 밖으로뺐다. */
    export let file = mongoose.model('file', new Schema({
        _itemId: Schema.Types.ObjectId,
        name: String,
        userId: String,
        path: String,
        url: String,
        virtualName: String,
        size: String,
        isImg: Boolean,
        type: String,
        needDelete: {type: Boolean, default: false},
        regDt: {type: Date, default: Date.now}
    }));

    /* 게시판 */
    export let board = mongoose.model('board',  new Schema({
        _menuId: Schema.Types.ObjectId,
        userId: String,
        title: String,
        content: String,
        hasTag: [String],
        /* file doc 스키마를 보면된다. */
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

