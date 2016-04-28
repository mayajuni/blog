/**
 * Created by mayaj on 2016-04-25.
 */
import {Models} from '../models/models';
import {Crypto} from '../module/crypto';
import {error} from "../module/error";

const Admin = Models.admin;

export module LoginService {
    /**
     * 일반적인 로그인
     * 
     * @param userId
     * @param password
     * @returns {T}
     */
    export async function login(userId: string, password: string) {
        const passwordKey = process.env.PASSWORD_KEY || 'testKey';

        const admin: any = await Admin.findOne({_id: userId, password: Crypto.encrypt(password, passwordKey)}, {password: 0});

        if(!admin) {
            /* '아이디/패스워드를 확인해주세요.' */
            error(400, 'check_id_pw');
        }

        admin._doc.userId = admin._id;
        delete admin._doc._id;

        return admin;
    }

    /**
     * 토큰 로그인
     * 
     * @param token
     * @returns {T}
     */
    export async function tokenLogin(token) {
        const admin: any = await Admin.findOne({token: token}, {password: 0});
        
        if(!admin) {
            /* 잘못된 토큰 입니다. */
            error(400, 'bad_token');
        }

        admin._doc.userId = admin._id;
        delete admin._doc._id;

        return admin;
    }
}