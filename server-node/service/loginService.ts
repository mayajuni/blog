/**
 * Created by mayaj on 2016-04-25.
 */
import {Models} from '../models/models';
import {Crypto} from '../module/crypto';
import {error} from "../module/error";

const Admin = Models.admin;
const passwordKey = process.env.PASSWORD_KEY || 'testKey';

export module LoginService {
    /**
     * 일반적인 로그인
     * 
     * @param userId
     * @param password
     * @returns {T}
     */
    export async function login(userId: string, password: string) {
        const admin = await Admin.findOne({_id: userId, password: Crypto.encrypt(password, passwordKey)}, {password: -1});

        if(!admin) {
            error(409, '아이디 / 패스워드를 확인해주세요.');
        }

        return admin;
    }

    /**
     * 토큰 로그인
     * 
     * @param token
     * @returns {T}
     */
    export async function tokenLogin(token) {
        const admin = await Admin.findOne({token: token}, {password: -1});
        
        if(!admin) {
            error(409, '토큰이 잘못되었습니다.');
        }

        return admin;
    }
}