const CryptoJs = require("crypto-js");
const uuid = require("node-uuid");
const { key } = require("../../.env/keys");
const userModel = require("../../models/Account")

class checkPoint {

    constructor () {
        this.textKey = key,
        this.validCookieDays = 3,
        this.ok = "Grand-Access",
        this.err = "Access-Denied",
        this.spliter = ";_"
    }

    async chechAccount(id, status) {
        const userData = await userModel.findOne({id: id});
        if (userData) {
            if (userData.status_id !== "0" ) {
                if (status === "0" && userData.status_id === "__Default" || status === userData.status_id) {
                    return { ok: userData.id, username: `${userData.first_Name} ${userData.last_Name}`, phone_no: userData.phone_no }

                } else {
                    return { err: this.err }
                }
    
            } else {
                return { logOut: 'logOut' }
            }

            } else {
                return { err: this.err }
            }

    }

    async updateAccount(phone_no, password, id, dvc, status, login, double) {
        const bycrpt = require("bcryptjs");
        const userData = await userModel.findOne({ phone_no: phone_no});
        if (userData) {
            if (login) {
                const passwordMatching = await bycrpt.compare(password, userData.password);
                if (!passwordMatching) {
                    return { pwdErr: 404 }  // "Your Password isn't Match!"
    
                } else if (dvc !== userData.device && userData.status_id !== "__Default") {
                    if (double === true) {  // Remain and not update the device any more
                        if (userData.status_id === '0') {   // i.e log out user
                            await userModel.findOneAndUpdate(
                                {phone_no: phone_no},
                                {id: id, status_id: status},
                                {new: true}
                            );
                            return { doubleDvcLogin: 'Ok' }

                        } else {
                            return { id: userData.id, status: userData.status_id }

                        }
        
                    } else if (double === false) {  // Updae the device 
                        await userModel.findOneAndUpdate(
                            {phone_no: phone_no},
                            {id: id, device: dvc, status_id: status},
                            {new: true}
                        );
                        return { ok: 'Ok' }

                    } else {
                        return { dvc: "Double"}

                    }
    
                } else {
                    await userModel.findOneAndUpdate(
                        {phone_no: phone_no},
                        {id: id, device: dvc, status_id: status},
                        {new: true}
                    );
                    return { ok: 'Ok' }
    
                }

            } else {
                await userModel.findOneAndUpdate(
                    {phone_no: phone_no},
                    {id: id, device: dvc, status_id: status},
                    {new: true}
                );

            }

        } else {
            return { phoneNoErr: 404 } // "Sorry! Your Phone Number isn?'t Registered"
        }
    }

    generatedKey() {
        let key = CryptoJs.lib.WordArray.random(32);
        return CryptoJs.enc.Hex.stringify(key);
    }
    
    generatedIv() {
        let key = CryptoJs.lib.WordArray.random(16);
        return CryptoJs.enc.Hex.stringify(key); 
    }

    encryptKey(text, keyString, ivString) {
        let iv = CryptoJs.enc.Hex.parse(ivString);
        let key = CryptoJs.enc.Hex.parse(keyString);
        const options = {
            iv,
            mode: CryptoJs.mode.CBC,
            padding: CryptoJs.pad.Pkcs7,
        }

        let cipherBytes = CryptoJs.AES.encrypt(text, key, options);
        return cipherBytes.toString();
    }

    dateTime() {
        let date = new Date()
        let expirationDaysDate = new Date(date.getTime())
            expirationDaysDate.setDate(date.getDate() + this.validCookieDays)
            expirationDaysDate.setHours(expirationDaysDate.getHours() + 1)
        return expirationDaysDate.toUTCString();
    }

    checkDateExpiration(tm) {
        let todayDate = new Date();
        let passDaysDate = new Date(tm);
        let days =  passDaysDate.getDate() - todayDate.getDate();
        
        let remainingHours =  passDaysDate.getTime() - todayDate.getTime();
        let hours = Math.floor(remainingHours / (1000 * 60 * 60 ));

        if (days <= 0 && hours <= 1) {
            //Upadte date
            return { update: tm}

        } else {
            //Remain
            return { still: tm }
        }

    }

    cookieId() {
        const id = uuid.v4();
        return id
    }

    cookieOptions() {
        const time = this.dateTime();
        return {
            expirationDate: time,
            path: '/',
            // httpOnly: true,
            // secure: true,
            sameSite: 'strict'
        }
    }

    createCookie(device, login) {
        const iv = this.generatedIv();
        const key = this.generatedKey();
        const ckId = this.cookieId();
        const time = this.dateTime();
        const encryptedText = this.encryptKey(this.textKey, key, iv);

        let log;
        let cookie;
        if (login) {
            log = this.cookieId().substring(0, 8);
            cookie = ckId;
        } else {
            log = "0";
            cookie = ckId.substring(0, 14).repeat(2).concat('_AowG');
        }

        return {
            cookieOptions: this.cookieOptions(),
            userCookie: {
                _hd_: encryptedText + this.spliter + key + this.spliter + iv,
                _ck_: cookie,
                _dvc_: device,
                _time_: time,
                _st_: log
            }
        }

    }

    async parseCookie(master, ck, device) {
        const parsedCookie = master.parse(ck);
        if (parsedCookie) {
            const slicedCK = parsedCookie.credentials;
            try {
                const cookie = JSON.parse(slicedCK);
                
                const slicedCipherBytes = cookie._hd_.split(this.spliter)[0];
                const slicedKey = cookie._hd_.split(this.spliter)[1];
                const slicedIv = cookie._hd_.split(this.spliter)[2];
                const _ck = cookie._ck_;
                const time = cookie._time_;
                const status = cookie._st_;
                const checkDateExpiration = this.checkDateExpiration(time);
        
                const iv = CryptoJs.enc.Hex.parse(slicedIv);
                const key = CryptoJs.enc.Hex.parse(slicedKey);
                const options = {
                    iv,
                    mode: CryptoJs.mode.CBC,
                    padding: CryptoJs.pad.Pkcs7,
                };
                const cipherBytes = CryptoJs.AES.decrypt(slicedCipherBytes, key, options);
                const text = cipherBytes.toString(CryptoJs.enc.Utf8);
        
                if (text === this.textKey) {
                    let userData = await this.chechAccount(_ck, status);
                    if (userData.ok) {
                        if (checkDateExpiration.still) {
                            return { cookie: userData.ok, username: userData.username, phone_no: userData.phone_no  }
        
                        } else {
                            return checkDateExpiration
                        }
        
                    } else {
                        return userData 
                    }
        
                } else {
                    return {
                        err: this.err
                    }
        
                }
    
            } catch (err) {
                return { parseErr: this.err }
            }

        }

    }

    async updateCookie(phone_no, password, device, login, double) {
        if (login !== 'logOut') {
            const updatedCookie = this.createCookie(device, true);
            const id = updatedCookie.userCookie._ck_;
            const status = updatedCookie.userCookie._st_;
            if (double === true || double === false) {
                const Account = await this.updateAccount(phone_no, password, id, device, status, true, double);
                if (double === true) { // dvc remain i.e double
                    Account.doubleDvcLogin ? updatedCookie.userCookie._ck_ : updatedCookie.userCookie._ck_ = Account.id;
                    Account.doubleDvcLogin ? updatedCookie.userCookie._st_ : updatedCookie.userCookie._st_ = Account.status;
                    return {
                        updated: updatedCookie,
                        Account: Account
                    }

                } else {
                    return {
                        updated: updatedCookie,
                        Account: Account
                    }

                }
                
            } else {
                const Account = await this.updateAccount(phone_no, password, id, device, status, true);
                if (Account.ok) {
                    return {
                        updated: updatedCookie,
                        Account: Account
                    }
    
                } else {
                    return {
                        AccountErr: Account
                    }
    
                }

            }
            
        } else if (login === 'logOut') {
            const updatedCookie = this.createCookie(device);
            const id = updatedCookie.userCookie._ck_;
            const status = updatedCookie.userCookie._st_;

            await this.updateAccount(phone_no, null, id, device, status);
            return {
                updated: updatedCookie,
            }

        } else {
            const updatedCookie = this.createCookie(device);
            const id = updatedCookie.userCookie._ck_;
            const status = updatedCookie.userCookie._st_;

            await this.updateAccount(phone_no, password, id, device, status);

            return {
                updated: 'updatedCookie',
            }

        }


    }
    
}

module.exports = {
    cookie: checkPoint
}