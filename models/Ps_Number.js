
const {connection, mysql} = require("../connection/dbConnection");
const { psGenerator, comparePsNo } = require("../utils/computation/psGen");

const moment = require("moment");
const EventEmitter = require("node:events");

const eEmitter = new EventEmitter();

class  db {

    constructor() {

        this.result = '';
        this.Algo = "A3I1";

        this.errMsg = "Sorry something went wrong";
        this.dupKey = 'ER_DUP_ENTRY';
        this.errCounter = 0;    //Counting how much er_dub_key gotten while inserting

    }
    
    alertOk(msg) {
        eEmitter.emit('psNoInfo', msg);
    }

    // Storing user psNo into the database
    async insert (arg) {
        let data = await psGenerator.psNumber();
        if (data !== undefined) {

            let id = data.psId,
            psNo = data.hashedPsNo,
            phoneNumber = arg,
            userPsNo = data.userPsNo,
            time = new Date().toDateString() + " " + "-" + " " + new Date().toLocaleTimeString();
    
            //  Storing userPsNo data
            const queryString = 'INSERT INTO Ps_Number SET ?';
            const params = {id: id, ps_number: psNo, phoneNo: phoneNumber, create_at: time}
            
            connection.query(queryString, [params], (err, res) => {
                if (err) {
                    if (err.code === this.dupKey) {
                        this.errCounter = 0;
                        setTimeout(() => {
                            this.repeatInsertion();
                        }, 700);
                        return; 
    
                    } else {
                        return this.alertOk(this.errMsg); 
                    }
                }
                
                if (res) {
                    return this.alertOk({userPsNo: userPsNo});
                }
            });
            
        } else {
            return this.alertOk(`${this.errMsg} Please Try Again`);
        }
    }

    // Repeat insertion when id seems to appear twice in db
    async repeatInsertion () {
        let data = await psGenerator.psNumber(), 
        id = data.psId,
        psNo = data.hashedPsNo,
        userPsNo = data.userPsNo,
        time = new Date().toDateString() + " " + "-" + " " + new Date().toLocaleTimeString();

        // store again user data
        const queryString = 'INSERT INTO Ps_Number SET ?';
        const params = {id: id, ps_number: psNo, create_at: time}
    
        connection.query(queryString, [params], (err, res) => {
            if (err) {
                if (err.code === this.dupKey) {

                    if (this.errCounter <= 3) {
                        setTimeout(() => {
                            this.repeatInsertion();
                            this.errCounter += 1;
                        }, 500);
                        
                    } else {
                        return this.alertOk(this.errMsg); 
                    }

                } else {
                    return this.alertOk(this.errMsg); 
                }
            }
            
            if (res) {
                return this.alertOk({userPsNo: userPsNo}); 
            }
        });

    }

    psNoInfo(msg) {
        eEmitter.emit('Access-Info', msg);
    }

    // logIn session
    checksExistingPsNo(psNo) {

        const ps_number = this.psNoAnalysis(psNo),
              sql = "SELECT id, ps_number, phoneNo FROM Ps_Number WHERE id = " + mysql.escape(ps_number.id);        

          connection.query(sql, async (err, result) => {
            if (err) {
                return this.psNoInfo({ status: false, phone_no: undefined, msg: "Something Went Wrong Please Try again" });
            }
            if (result) {
                if (result[0] !== undefined) {
                    let isMatch = await comparePsNo(ps_number.psNo, result[0].ps_number);
                    return this.psNoInfo({ status: isMatch, phone_no: result[0].phoneNo });
                    
                } else {
                    return this.psNoInfo({ status: false, phone_no: undefined, msg: "Incorrect Ps-Number!" });
                }
            }
        })
              
    }

    psNoAnalysis(psNo) {
        var params = psNo.split("-");
        let paramsOne = params[0].toString();
        let paramsTwo = params[1].toString();

        // the ps
        let ps_no = psNo.replace("-", this.Algo);

        if (paramsOne.length === 3) {
            return {id: paramsOne, psNo: ps_no} 
            
        } else if (paramsTwo.length === 3) {
            return {id: paramsTwo, psNo: ps_no}
            
        }

    }

}

module.exports = {
    db,
    eEmitter
}
