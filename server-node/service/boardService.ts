/**
 * Created by mayaj on 2016-04-26.
 */
import {Models} from '../models/models';
import {FileService} from './fileService'
import {error} from "../module/error";

const Board = Models.board;

export module BoardService {
    /**
     * 게시판을 페이징 처리하여 가지고 온다.
     *
     * @param _menuId
     * @param title
     * @param page
     * @param view
     * @returns {{totalCount: number, items: (Query<T[][]>|Query<T>), nowPage: number}}
     */
    export async function get(_menuId: string, title: string, page: number, view: number) {
        let query: any = {};
        if(_menuId) {
            query._menuId = _menuId;
        }
        if(title) {
            query.title = {$regex: title};
        }

        page = Number(page) || 1;
        view = Number(view) || 15;

        const totalCount: any = await Board.count(query);
        let items: any = await Board.find(query).sort({regDt : -1}).skip(view * (page- 1)).limit(view);

        const result = {
            totalCount: totalCount,
            items: items,
            nowPage: page
        };

        return result;
    }

    /**
     * 게시판 상세를 가지고 온다.
     *
     * @param _id
     * @returns {Query<T>}
     */
    export function getDetail(_id: string) {
        return Board.findOne({_id: _id});
    }

    /**
     * 게시판을 수정한다.
     *
     * @param userId
     * @param boardVO
     */
    export async function put(userId: string, boardVO: any) {
        const result: any = await Board.update({_id: boardVO._id, userId: userId},{$set: boardVO});

        if(result.nModified < 1) {
            error(400, 'no_authority');
        }

        return result;
    }

    /**
     * 게시판 삭제
     * 파일도 같이 삭제 요청처리 한다.(파일 삭제는 스케쥴러에서 따로 진행)
     * 
     * @param userId
     * @param _id
     */
    export async function remove(userId: string, _id: string) {
        const board: any = await Board.findOne({_id: _id, userId: userId});
        if(!board) {
            error(400, 'no_authority');
        }

        const result = await Board.remove({_id: _id, userId: userId});

        if(board.files){
            await FileService.remove(_id);
        }

        return result;
    }

    /**
     * 게시판 저장
     * 
     * @param userId
     * @param boardVO
     */
    export async function save(userId: string, boardVO: any) {
        let board: any = new Board(boardVO);
        board.userId = userId;
        let result: any = await board.save();
        if(boardVO.files && boardVO.files.length > 0) {
            await FileService.addItemIds(boardVO.files, result._id);
        }

        return result;
    }

    /**
     * 게시판 테스트 저장
     */
    export function saveTest() {
        let board: any = new Board({title: '테스트라더만 ㅋㅋ', content: '테스트입니다.', _menuId: '5726f8266a7a32bc143c6c8f', tags: ['test1', 'test2', 'test3'], files: [], userId: 'test2'});
        return board.save();
    }

    /**
     * 게시판 테스트 삭제
     */
    export function removeTest() {
        return Board.remove({userId: 'test2'});
    }
}