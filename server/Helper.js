import Validator from 'validator';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from './databaseConnection';
import { INTERVENTION_RECORD } from './types/constants';

/*

*/

class Helper {
    constructor() {
        this.executeQuery = this.executeQuery.bind(this);
        this.connectToDb = this.connectToDb.bind(this);
        this.assignToken = this.assignToken.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.insertRecord = this.insertRecord.bind(this);
        this.groupAttachment = this.groupAttachment.bind(this);
    }

    trimWhiteSpace(obj) {
        if (typeof obj !== 'undefined' && obj !== '' && typeof obj === 'object' && typeof obj.length === 'undefined') {
            Object.keys(obj).forEach((key) => {
                if (obj[key] !== null && typeof obj[key] !== 'number' && !Array.isArray(obj[key])) {
                    obj[key] = obj[key].trim();
                }
            });
            return obj;
        }
        return '';
    }

    validateKey(obj, keys) {
        if (typeof obj === 'undefined' && typeof obj.length === 'undefined') {
            return false;
        }
        const objetctKey = Object.keys(obj);
        let keyMatch;
        for (let i = 0; i < keys.length; i++) {
            keyMatch = false;
            for (let j = 0; j < objetctKey.length; j++) {
                if (keys[i] === objetctKey[j]) {
                    keyMatch = true;
                }
            }
            if (!keyMatch) {
                return false;
            }
        }
        if (keyMatch) {
            return true;
        }
        return false;
    }

    validateInput(res, obj) {
        if (typeof obj !== 'undefined' && obj !== '' && typeof obj === 'object' && typeof obj.length === 'undefined') {
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === 'firstname' || keys[i] === 'lastname') {
                    if (typeof obj[keys[i]] === undefined || obj[keys[i]] === '' || /[@!#$%^&*()\d~`<>?":{}+=?/]/i.test(obj[keys[i]])) {
                        res.statusCode = 400;
                        res.setHeader('content-type', 'application/json');
                        res.json({ message: `${keys[i]}  required and no special character allowed` });
                        return false;
                    }
                }
                if (keys[i] === 'phonenumber') {
                    if (typeof obj[keys[i]] === 'undefined' || obj[keys[i]] === '' || !Validator.isNumeric(obj[keys[i]]) || obj[keys[i]].length < 11) {
                        res.statusCode = 400;
                        res.setHeader('content-type', 'application/json');
                        res.json({ message: `${keys[i]}  required and must be numbers of 11 digits` });
                        return false;
                    }
                }
                if (keys[i] === 'email') {
                    if (!Validator.isEmail(obj[keys[i]])) {
                        res.statusCode = 400;
                        res.setHeader('content-type', 'application/json');
                        res.json({ message: `${keys[i]}  required and must be in valid format` });
                        return false;
                    }
                } else if (typeof obj[keys[i]] === 'undefined' || obj[keys[i]] === '') {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({ message: `${keys[i]} required` });
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
 * Initiates connection a database.
 * @author: charles
 */
    connectToDb() {
        return new Promise((resolve, reject) => {
            pool.connect((err, client, done) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(client, done);
                }
            });
        });
    }

    /**
 * Executes a query againt postgress database
 *
 *
 * @author: charles
 * @param {sql, params} r takes in the sql statement and the parameters to be passed in.
 */
    executeQuery(sql, params) {
        return new Promise((resolve, reject) => {
            this.connectToDb().then((client, done) => {
                if (typeof params !== 'undefined' && params.length > 0) {
                    client.query(sql, params, (err, result) => {
                        client.release();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    client.query(sql, (err, result) => {
                        client.release();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }
            })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
 * Assign token to user
 *
 *
 * @author: chalres
 * @param {payload}  The user details.
 */
    assignToken(payload) {
        const key = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
        return new Promise((resolve, reject) => {
            jwt.sign(payload, key, { expiresIn: '7 days' }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    displayMessage(res, statusCode, message, details) {
        if (typeof details !== 'undefined') {
            res.statusCode = statusCode;
            res.setHeader('content-type', 'application/json');
            console.log('err', details);
            return res.json({ message, details });
        }
        res.statusCode = statusCode;
        res.setHeader('content-type', 'application/json');
        return res.json({ message });
    }

    sendMail(useremail, message) {
        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: useremail,
                subject: process.env.EMAIL_SUBJECT,
                html: `<h3><strong>${message}</strong></h3>`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }

    callServer(res, sql, params) {
        if (typeof params.length !== 'undefined' && params.length > 0) {
            this.executeQuery(sql, params)
                .then((result) => {
                    if (!result.rows.length) {
                        res.statusCode = 404;
                        res.setHeader('content-type', 'application/json');
                        return res.json({
                            status: 404,
                            message: 'record not found',
                        });
                    }
                    const output = this.groupAttachment(result);
                    res.statusCode = 200;
                    res.setHeader('content-type', 'application/json');
                    return res.json({
                        status: 200,
                        data: output,
                    });
                })
                .catch(error => this.displayMessage(res, 500, 'Server error', error));
        } else {
            this.executeQuery(sql)
                .then((result) => {
                    if (!result.rows.length) {
                        res.statusCode = 404;
                        res.setHeader('content-type', 'application/json');
                        return res.json({
                            status: 404,
                            data: [],
                        });
                    }
                    const { rows } = result;
                    const output = [];
                    for (let i = 0; i < rows.length; i++) {
                        const {
                            recordid, comment, status, location, createdby,
                            createdon, type,
                        } = rows[i];
                        const Videos = [];
                        const Images = [];
                        for (let k = 0; k < rows.length; k++) {
                            if (rows[k].recordid === recordid) {
                                const {
                                    imagetitle, videotitle, videopath, imagepath,
                                } = rows[k];
                                if (videopath !== null) {
                                    Videos.push({ videopath, videotitle });
                                }
                                if (imagepath !== null) {
                                    Images.push({ imagepath, imagetitle });
                                }
                            }
                        }

                        const array = output.filter(element => element.recordid === recordid);
                        if (!array.length) {
                            output.push({
                                recordid,
                                comment,
                                status,
                                location,
                                createdby,
                                createdon,
                                type,
                                Video: Videos,
                                Image: Images,
                            });
                        }
                    }
                    res.statusCode = 404;
                    res.setHeader('content-type', 'application/json');
                    return res.json({
                        status: 404,
                        message: 'record not found',
                    });
                })
                .catch(error => this.displayMessage(res, 500, 'Server error', error));
        }
    }

    groupAttachment(result) {
        const { rows } = result;
        const output = [];
        for (let i = 0; i < rows.length; i++) {
            const {
                recordid, comment, status, location, createdby,
                createdon, type,
            } = rows[i];
            const Videos = [];
            const Images = [];
            for (let k = 0; k < rows.length; k++) {
                if (rows[k].recordid === recordid) {
                    const {
                        imagetitle, videotitle, videopath, imagepath,
                    } = rows[k];
                    if (videopath !== null) {
                        Videos.push({ videopath, videotitle });
                    }
                    if (imagepath !== null) {
                        Images.push({ imagepath, imagetitle });
                    }
                }
            }

            const array = output.filter(element => element.recordid === recordid);
            if (!array.length) {
                output.push({
                    recordid,
                    comment,
                    status,
                    location,
                    createdby,
                    createdon,
                    type,
                    Video: Videos,
                    Image: Images,
                });
            }
        }
        return output;
    }

    insertRecord(res, recordid, comment, userid, location, type) {
        const reportcategoryid = (type === INTERVENTION_RECORD) ? 1 : 2;
        const sql = `
            INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
            VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
        `;
        this.executeQuery(sql, [recordid, comment, userid, 'IN DRAFT', location, reportcategoryid, type, 'NOW()'])
            .then((result) => {
                const sql = `
            SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
             where R.recordid = $1;
            `;
                this.executeQuery(sql, [recordid])
                    .then((result) => {
                        const output = this.groupAttachment(result);
                        res.statusCode = 201;
                        res.setHeader('content-type', 'application/json');
                        return res.json({
                            status: 201,
                            data: [{
                                recordid,
                                message: 'Created intervention record',
                                report: output,
                            }],
                        });
                    })
                    .catch(error => this.displayMessage(res, 500, error));
            })
            .catch(error => this.displayMessage(res, 500, error));
    }
}

export default new Helper();
