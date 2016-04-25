/**
 * Created by mayaj on 2016-04-25.
 */
import * as crypto from 'crypto';

/**
 * 암호/복호화
 */
export module Crypto {
    const localKey = 'ifYouDontHaveKey,YouUseThisKey';

    /**
     * 암호화
     * 
     * @param text
     * @param key
     * @returns {string}
     */
    export function encrypt(text: string, key: string): string {
        let cryptoKey = !key ? localKey : key;
        const cipher = crypto.createCipher('aes-256-cbc',cryptoKey);
        let encipheredContent: string = cipher.update(text,'utf8','hex');
        encipheredContent += cipher.final('hex');
        return encipheredContent;
    }

    /**
     * 복호화
     * 
     * @param text
     * @param key
     * @returns {string}
     */
    export function decrypt(text: string, key: string): string {
        let cryptoKey = !key ? localKey : key;
        const cipher = crypto.createDecipher('aes-256-cbc',cryptoKey);
        var decipheredPlaintext = cipher.update(text,'hex','utf8');
        decipheredPlaintext += cipher.final('utf8');
        return decipheredPlaintext;
    }
}