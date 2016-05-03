/**
 * Created by mayaj on 2016-04-26.
 */
import * as request from 'request-promise';
import * as cheerio from 'cheerio';
import {Models} from '../models/models';
import {error} from "../module/error";

const Bookmark = Models.bookmark;

export module BookmarkService {
    /**
     * 북마크들을 가지고 온다.
     *
     * @param tags
     * @returns {Query<T[]>}
     */
    export function get(tags: string[]) {
        let query: any = {};
        if(tags) {
            if(typeof tags === 'string') {
                query.tags = {$elemMatch: {$eq: tags}};
            }else{
                query.tags = {$in: tags};
            }
        }

        return Bookmark.find(query);
    }

    /**
     * url의 정보를 가지고 온다.
     *
     * @param url
     * @returns {any}
     */
    export async function getUrlInfo(url: string) {
        if(!url.includes('http://') && !url.includes('https://')) {
            url = `http://${url}`;
        }

        const html = await request(url);
        const $ = cheerio.load(html);
        let htmlInfo: any = {
            'og:title':null,
            'og:description':null,
            'og:image':null
        };
        const meta = $('meta');
        const keys = Object.keys(meta);
        for (let s in htmlInfo) {
            keys.forEach(function(key) {
                if ( meta[key].attribs
                    && meta[key].attribs.property
                    && meta[key].attribs.property === s) {
                    htmlInfo[s] = meta[key].attribs.content;
                }
            })
        }
        htmlInfo.title = $('title').html();

        return htmlInfo;
    }

    /**
     * 북마크 저장
     * bookmarkVO는 bookmark router에서 확인하기 바랍니다.
     *
     * @param userId
     * @param bookMarkVO
     * @returns {any|void|Query<T>}
     */
    export function save(userId: string, bookmarkVO: any) {
        if(!bookmarkVO.url.includes('http://') && !bookmarkVO.url.includes('https://')) {
            bookmarkVO.url = `http://${bookmarkVO.url}`;
        }
        let bookmark: any = new Bookmark(bookmarkVO);
        bookmark.userId = userId;
        return bookmark.save();
    }

    /**
     * 수정
     * bookmarkVO는 bookmark router에서 확인하기 바랍니다.
     *
     * @param userId
     * @param bookmarkVO
     * @returns {Query<T>}
     */
    export async function put(userId: string, bookmarkVO: any) {
        if(!bookmarkVO.url.includes('http://') && !bookmarkVO.url.includes('https://')) {
            bookmarkVO.url = `http://${bookmarkVO.url}`;
        }
        const result: any = await Bookmark.update({_id: bookmarkVO._id, userId: userId},{$set: bookmarkVO});

        if(result.nModified < 1) {
            error(400, 'no_authority');
        }
        return result
    }

    /**
     * 삭제
     *
     * @param userId
     * @param _id
     */
    export async function remove(userId: string, _id: string) {
        const result: any = await Bookmark.remove({_id: _id, userId: userId});

        if(result.result.n < 1) {
            error(400, 'no_authority');
        }

        return result;
    }



    /**
     * 게시판 테스트 저장
     */
    export function saveTest() {
        let board: any = new Bookmark({title: '테스트', memo: '테스트입니다.', tags: ['test1', 'test2', 'test3'], url: 'naver.com', imgUrl: 'http://static.naver.net/www/mobile/edit/2016/0407/mobile_17004159045.png', userId: 'test2'});
        return board.save();
    }

    /**
     * 게시판 테스트 삭제
     */
    export function removeTest() {
        return Bookmark.remove({userId: 'test2'});
    }
}