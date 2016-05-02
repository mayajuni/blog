/**
 * Created by mayaj on 2016-04-26.
 */
import {Models} from '../models/models';
import {error} from "../module/error";

const Menu = Models.menu;

export module MenuService {
    /**
     * 메뉴를 리턴
     *
     * @returns {Query<T[]>}
     */
    export function get() {
        return Menu.find({});
    }

    /**
     * step1 저장
     *
     * @param userId
     * @param menuVO
     */
    export async function save(userId: string, menuVO: any) {
        const count: any = await Menu.count({name: menuVO.name});
        if(count > 0) {
            error(400, 'same_name');
        }
        let menu: any = new Menu(menuVO);
        menu.userId = userId;
        return menu.save();
    }

    /**
     * 메뉴 삭제 (step2도 같이 삭제)
     *
     * @param userId
     * @param _Id
     */
    export async function remove(userId: string, _id: string) {
        const result: any = await Menu.remove({_id: _id, userId: userId});

        if(result.result.n < 1) {
            error(400, 'no_authority');
        }

        return result;
    }

    /**
     * 메뉴 수정
     *
     * @param userId
     * @param menuVO
     */
    export async function put(userId: string, menuVO: any) {
        const result: any = await Menu.update(
            {_id: menuVO._id, userId: userId},
            {$set: {nickName: menuVO.nickName, url: menuVO.url, rank: menuVO.rank}}
        );

        if(result.nModified < 1) {
            error(400, 'no_authority');
        }
        return result
    }

    /**
     * step2를 저장
     *
     * @param userId
     * @param _id
     * @param menuVO
     * @returns {any}
     */
    export async function step2Save(userId: string, _id: string, menuVO: any) {
        const count: any = await Menu.count({_id: _id, 'subMenuList.name': menuVO.name});

        if(count>0) {
            error(400, 'same_name');
        }
        const result: any = await Menu.update({_id: _id, userId: userId}, {$push: {subMenus: menuVO}});

        if(result.nModified < 1) {
            error(400, 'no_authority');
        }

        return result
    }

    /**
     * step2 삭제
     *
     * @param userId
     * @param _id
     * @param _step2Id
     */
    export async function step2Remove(userId: string, _id: string) {
        const result: any = await Menu.update({userId: userId, subMenus: {$elemMatch: {_id: _id}}}, {$pull: {subMenus: {_id: _id}}});

        if(result.nModified < 1) {
            error(400, 'no_authority');
        }
        return result
    }

    /**
     * step2 수정
     * 
     * @param userId
     * @param menuVO
     */
    export async function step2Put(userId: string, _id: string, menuVO: any) {
        const result: any = await Menu.update(
            {_id: _id, userId: userId, subMenus: {$elemMatch: {_id: menuVO._id}}},
            {$set: {'subMenus.$.nickName': menuVO.nickName, 'subMenus.$.url': menuVO.url, 'subMenus.$.rank': menuVO.rank}});

        if(result.nModified < 1) {
            error(400, 'no_authority');
        }
        return result
    }
}