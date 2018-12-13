import Helper from '../Helper';
import {
    SUPER_ADMINISTRATOR, USER_ROLE, RED_FLAG, IN_DRAFT,
} from '../types/constants';

class RedFlagController {
    constructor() {
        this.getRedFlags = this.getRedFlags.bind(this);
        this.getARecord = this.getARecord.bind(this);
        this.postRecord = this.postRecord.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.updateRedFlagStatus = this.updateRedFlagStatus.bind(this);
    }

    getRedFlags(req, res) {
        if (req.token) {
            const user = req.token;
            const { rolename, userid } = user;
            if (rolename === SUPER_ADMINISTRATOR) {
                const sql = `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                WHERE R.type = $1;`;
                return Helper.callServer(res, sql, [RED_FLAG]);
            }
            if (rolename == USER_ROLE) {
                const sql = `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where R.type = $1 AND R.createdby = $2;`;
                return Helper.callServer(res, sql, [RED_FLAG, userid]);
            }
        }
    }

    getARecord(req, res) {
        if (/^\d+$/.test(req.params.id)) {
            const flagId = parseInt(req.params.id);
            if (req.token) {
                const { rolename, userid } = req.token;
                if (rolename === SUPER_ADMINISTRATOR) {
                    const sql = `
                    SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                    R.status,R.reportcategoryid, R.type,
                    R.createdon, A.attachmentid,A.videotitle,A.videopath,
                    A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                     where R.type = $1 AND R.recordid = $2;
                    `;
                    return Helper.callServer(res, sql, [RED_FLAG, flagId]);
                }
                if (rolename === USER_ROLE) {
                    const sql = `
                    SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                    R.status,R.reportcategoryid, R.type,
                    R.createdon, A.attachmentid,A.videotitle,A.videopath,
                    A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                     where (R.type = $1 AND R.recordid = $2) AND R.createdby = $3;
                    `;
                    return Helper.callServer(res, sql, [RED_FLAG, flagId, userid]);
                }
            }
        } else {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 400,
                error: 'Route not registered',
            });
        }
    }

    postRecord(req, res) {
        const flagRecord = Helper.trimWhiteSpace(req.body);
        const { userid, rolename } = req.token;
        if (!Helper.validateKey(flagRecord, ['comment', 'location', 'type'])) {
            return Helper.displayMessage(res, 400, 'Bad Request,one or more keys is missing');
        }
        const {
            createdBy, type, location, Images, Videos, comment,
        } = flagRecord;
        const recordid = 3000 + new Date().getUTCMilliseconds();
        let imageparams = ''; let
            videoparams = '';
        if (Videos.length) {
            const videos = [];
            for (let i = 0; i < Videos.length; i++) {
                videos.push(`(${recordid},'${Videos[i].videotitle}','${Videos[i].videopath}', NOW())`);
            }
            videoparams = videos.join();
            const sql = `
                INSERT INTO BASE_ATTACHMENT(recordid,videotitle,videopath, datecreated) VALUES ${videoparams}
             `;

            Helper.executeQuery(sql)
                .then((result) => {
                    if (Images.length) {
                        const images = [];
                        for (let i = 0; i < Images.length; i++) {
                            images.push(`(${recordid},'${Images[i].imagetitle}','${Images[i].imagepath}', NOW())`);
                        }
                        imageparams = images.join();
                        const sql = `
                        INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}
                     `;

                        Helper.executeQuery(sql)
                            .then(result => Helper.insertRecord(res, recordid, comment, userid, location, type))
                            .catch((error) => { Helper.displayMessage(res, 500, error); });
                    } else {
                        return Helper.insertRecord(res, recordid, comment, userid, location, type);
                    }
                })
                .catch((error) => { Helper.displayMessage(res, 500, error); });
        } else if (Images.length) {
            const images = [];
            for (let i = 0; i < Images.length; i++) {
                images.push(`(${recordid},'${Images[i].imagetitle}','${Images[i].imagepath}', NOW())`);
            }
            imageparams = images.join();
            const sql = `
            INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}
            `;

            Helper.executeQuery(sql)
                .then(result => Helper.insertRecord(res, recordid, comment, userid, location, type))
                .catch((error) => { Helper.displayMessage(res, 500, error); });
        } else {
            return Helper.insertRecord(res, recordid, comment, userid, location, type);
        }
    }

    /**
 *
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * @memberof RedFlagController
 */
    updateLocation(req, res) {
        const flagRecord = Helper.trimWhiteSpace(req.body);
        const { userid } = req.token;
        if (!Helper.validateKey(flagRecord, ['location'])) {
            return Helper.displayMessage(res, 400, 'location is required');
        }
        if (/^\d+$/.test(req.params.id)) {
            const { location } = flagRecord;
            const requestId = parseInt(req.params.id);
            const sql = 'SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3';
            Helper.executeQuery(sql, [requestId, userid, RED_FLAG])
                .then((result) => {
                    if (result.rows.length) {
                        if (result.rows[0].status === IN_DRAFT) {
                            const sql = `
                            UPDATE BASE_REPORT SET location = $1 WHERE recordid = $2 AND type = $3
                        `;
                            Helper.executeQuery(sql, [location, requestId, RED_FLAG])
                                .then((result) => {
                                    const sql = `
                                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                                R.status,R.reportcategoryid, R.type,
                                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                                WHERE R.recordid = $1;
                            `;
                                    return Helper.callServer(res, sql, [requestId]);
                                })
                                .catch(error => Helper.displayMessage(res, 500, error));
                        } else {
                            return Helper.displayMessage(res, 406, 'can not perform action');
                        }
                    } else {
                        return Helper.displayMessage(res, 404, 'record not found');
                    }
                })
                .catch(error => Helper.displayMessage(res, 500, error));
        } else {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 400,
                error: 'Invalid request',
            });
        }
    }

    /**
     *
     *
     * @param {*} req
     * @param {*} res
     * @returns
     * @memberof RedFlagController
     */
    updateComment(req, res) {
        const flagRecord = Helper.trimWhiteSpace(req.body);
        const { userid } = req.token;
        if (!Helper.validateKey(flagRecord, ['comment'])) {
            return Helper.displayMessage(res, 400, 'comment is required');
        }
        if (/^\d+$/.test(req.params.id)) {
            const { comment } = flagRecord;
            const requestId = parseInt(req.params.id);
            const sql = 'SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3';
            Helper.executeQuery(sql, [requestId, userid, RED_FLAG])
                .then((result) => {
                    if (result.rows.length) {
                        if (result.rows[0].status === IN_DRAFT) {
                            const sql = `
                            UPDATE BASE_REPORT SET comment = $1 WHERE recordid = $2 AND type = $3
                        `;
                            Helper.executeQuery(sql, [comment, requestId, RED_FLAG])
                                .then((result) => {
                                    const sql = `
                                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                                R.status,R.reportcategoryid, R.type,
                                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                                WHERE R.recordid = $1;
                            `;
                                    return Helper.callServer(res, sql, [requestId]);
                                })
                                .catch(error => Helper.displayMessage(res, 500, error));
                        } else {
                            return Helper.displayMessage(res, 406, 'can not perform action');
                        }
                    } else {
                        return Helper.displayMessage(res, 404, 'record not found');
                    }
                })
                .catch(error => Helper.displayMessage(res, 500, error));
        } else {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 400,
                error: 'Invalid request',
            });
        }
    }

    deleteRecord(req, res) {
        const flagRecord = Helper.trimWhiteSpace(req.body);
        const { userid } = req.token;
        if (/^\d+$/.test(req.params.id)) {
            const { comment } = flagRecord;
            const requestId = parseInt(req.params.id);
            const sql = 'SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2 AND type = $3';
            Helper.executeQuery(sql, [requestId, userid, RED_FLAG])
                .then((result) => {
                    if (result.rows.length) {
                        if (result.rows[0].status === IN_DRAFT) {
                            const sql = `
                            DELETE FROM BASE_REPORT WHERE recordid = $1 AND type = $2;
                        `;
                            Helper.executeQuery(sql, [requestId, RED_FLAG])
                                .then((result) => {
                                    const sql = 'DELETE FROM BASE_ATTACHMENT where recordid = $1 ';
                                    Helper.executeQuery(sql, [requestId])
                                        .then((result) => {
                                            res.statusCode = 200;
                                            res.setHeader('content-type', 'application/json');
                                            res.json({
                                                status: 200,
                                                data: [{
                                                    requestId,
                                                    message: 'red flag record has been deleted',
                                                }],
                                            });
                                        })
                                        .catch(error => Helper.displayMessage(res, 500, error));
                                })
                                .catch(error => Helper.displayMessage(res, 500, error));
                        } else {
                            return Helper.displayMessage(res, 406, 'can not perform action');
                        }
                    } else {
                        return Helper.displayMessage(res, 404, 'record not found');
                    }
                })
                .catch(error => Helper.displayMessage(res, 500, error));
        } else {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 400,
                error: 'Invalid request',
            });
        }
    }

    updateRedFlagStatus(req, res) {
        if (req.token) {
            const update = Helper.trimWhiteSpace(req.body);
            const { userid, rolename, email } = req.token;
            if (rolename === SUPER_ADMINISTRATOR) {
                if (!Helper.validateKey(update, ['status'])) {
                    return Helper.displayMessage(res, 400, 'status is required');
                }
                if (/^\d+$/.test(req.params.id)) {
                    const { status } = update;
                    const requestId = parseInt(req.params.id);
                    const sql = 'SELECT * FROM BASE_REPORT WHERE recordid = $1 AND type = $2';
                    Helper.executeQuery(sql, [requestId, RED_FLAG])
                        .then((result) => {
                            if (result.rows.length) {
                                const sql = `
                                UPDATE BASE_REPORT SET status = $1 WHERE recordid = $2 AND type = $3
                            `;
                                Helper.executeQuery(sql, [status, requestId, RED_FLAG])
                                    .then((result) => {
                                        Helper.sendMail(email, `Red-flag #${requestId} Status Updated to ${status}`)
                                            .then((info) => {
                                                res.statusCode = 200;
                                                res.setHeader('content-type', 'application/json');
                                                return res.json({
                                                    status: 200,
                                                    data: [
                                                        {
                                                            id: requestId,
                                                            message: 'Updated Red Flag record status',
                                                        },
                                                    ],
                                                });
                                            })
                                            .catch(error => Helper.displayMessage(res, 500, 'couldn\'t send email', error));
                                    })
                                    .catch(error => Helper.displayMessage(res, 500, error));
                            } else {
                                return Helper.displayMessage(res, 404, 'record not found');
                            }
                        })
                        .catch(error => Helper.displayMessage(res, 500, error));
                } else {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    return res.json({
                        status: 400,
                        error: 'Invalid request',
                    });
                }
            } else {
                res.statusCode = 403;
                res.setHeader('content-type', 'application/json');
                return res.json({
                    status: 403,
                    error: 'Can not perform action, please contact administrator',
                });
            }
        }
    }
}

export default RedFlagController;
