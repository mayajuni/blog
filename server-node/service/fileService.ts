/**
 * Created by mayaj on 2016-04-27.
 */
import * as fs from 'fs';
import {Models} from '../models/models';
import {error} from "../module/error";

const File = Models.file;

export module FileService {
    /**
     * DB에서 삭제 예정변경 처리 해준다. 실제 삭제는 따로 스케쥴러가 돌면서 진행을한다.
     *
     * @param _itemId
     */
    export function remove(_itemId: string) {
        return File.update({_itemId: _itemId}, {$set: {needDelete: true}});
    }

    /**
     * DB와 파일까지 삭제한다.
     *
     * @param _id
     */
    export async function realRemove(_id: string) {
        const fileInfo: any = await File.findByIdAndRemove(_id);
        if(!fileInfo) {
            error(400, `not_have`);
        }
        fs.unlinkSync(fileInfo.path);
        return null;
    }

    /**
     * 게시판 ID를 넣어준다
     *
     * @param files
     * @param _itemId
     * @returns {Query<T>}
     */
    export function addBoardId(files: any[], _itemId: string) {
        let fileIds: string[] = new Array();
        for(const file of files) {
            fileIds.push(file._id);
        }

        return File.update({_id: {$in: fileIds}}, {$set: {_itemId: _itemId}});
    }

    /**
     * 파일 업로드
     *
     * @param req
     */
    export async function save(userId: string, fileInfo: any) {
        if(!fileInfo) {
            error(400, 'not_file');
        }
        let file: any = new File(fileInfo);
        file.userId = userId;
        return file.save();
    }
}