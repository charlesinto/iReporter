import { records } from '../model';
import Helper from '../Helper';
import {SUPER_ADMINISTRATOR, USER_ROLE, RED_FLAG, IN_DRAFT} from '../types';

export const getRedFlags = (req, res) => {
    if(req.token){
        const user = req.token;
        const {rolename, userid} = user;
        if(rolename === SUPER_ADMINISTRATOR){
            let sql =
            `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
            WHERE R.type = $1;`;
           return callServer(res,sql,[RED_FLAG])

        }
        else if(rolename == USER_ROLE){
            let sql =
            `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
             where R.type = $1 AND R.createdby = $2;`;
           return  callServer(res,sql,[RED_FLAG, userid])
        }
    }
}

export const getARecord = (req,res) => {
    if(/^\d+$/.test(req.params.id)){
        const flagId = parseInt(req.params.id)
        if(req.token){
            const {rolename, userid} = req.token;
            if(rolename === SUPER_ADMINISTRATOR){
                let sql = `
                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where R.type = $1 AND R.recordid = $2;
                `
                return callServer(res,sql,[RED_FLAG, flagId])
            }
            else if (rolename === USER_ROLE){
                let sql = `
                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where (R.type = $1 AND R.recordid = $2) AND R.createdby = $3;
                `
                return callServer(res,sql,[RED_FLAG,flagId,userid])
            }
        }
        
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.json({
            status: 400,
            error: "Invalid request id"
        })
    }
    
}

export const postRecord = (req,res) => {
    const flagRecord = Helper.trimWhiteSpace(req.body);
    const { userid, rolename} = req.token;
    if(!Helper.validateKey(flagRecord, ['comment','location', 'type'])){
        return Helper.displayMessage(res,400,'Bad Request,one or more keys is missing')
    }
    const { createdBy,type,location, Images, Videos, comment } = flagRecord;
    const recordid = 3000 + new Date().getUTCMilliseconds();
    let imageparams = '', videoparams = '';
    if(Videos.length){

        const videos = [];
        for(let i = 0; i < Videos.length; i++){
            videos.push(`(${recordid},'${Videos[i].videotitle}','${Videos[i].videopath}', NOW())`);
        }
        videoparams = videos.join()
        let sql = `
            INSERT INTO BASE_ATTACHMENT(recordid,videotitle,videopath, datecreated) VALUES ${videoparams}
         `

         Helper.executeQuery(sql)
         .then(result => {
            if(Images.length){
                const images = [];
                for(let i = 0; i < Images.length; i++){
                    images.push(`(${recordid},'${Images[i].imagetitle}','${Images[i].imagepath}', NOW())`);
                }
                 imageparams = images.join()
                 let sql = `
                    INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}
                 `
        
                 Helper.executeQuery(sql)
                 .then(result => {
                    return insertRecord(res,recordid,comment,userid,location,type)
                 })
                 .catch(error => {Helper.displayMessage(res,500,error)})
            }
            else{
                return insertRecord(res,recordid,comment,userid,location,type)
            }
            
         })
         .catch(error => {Helper.displayMessage(res,500,error)})
    }
    else if (Images.length){
        const images = [];
        for(let i = 0; i < Images.length; i++){
            images.push(`(${recordid},'${Images[i].imagetitle}','${Images[i].imagepath}', NOW())`);
        }
        imageparams = images.join();
        let sql = `
        INSERT INTO BASE_ATTACHMENT(recordid,imagetitle,imagepath, datecreated) VALUES ${imageparams}
        `

        Helper.executeQuery(sql)
        .then(result => {
        return insertRecord(res,recordid,comment,userid,location,type)
        })
        .catch(error => {Helper.displayMessage(res,500,error)})
    }
    else{
        return insertRecord(res,recordid,comment,userid,location,type)
    }

}

export const updateLocation = (req, res) => {
    let flagRecord = Helper.trimWhiteSpace(req.body);
    const {userid} = req.token;
    if(!Helper.validateKey(flagRecord,['location'])){
        return Helper.displayMessage(res,400,'location is required')
    }
    if(/^\d+$/.test(req.params.id)){
        const { location } = flagRecord;
        const requestId = parseInt(req.params.id)
        let sql =   `SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2`;
        Helper.executeQuery(sql,[requestId, userid])
        .then(result => {
            if(result.rows.length){
                if(result.rows[0].status === IN_DRAFT){
                    let sql = `
                        UPDATE BASE_REPORT SET location = $1 WHERE recordid = $2
                    `
                    Helper.executeQuery(sql,[location, requestId])
                    .then(result => {
                        let sql = `
                            SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                            R.status,R.reportcategoryid, R.type,
                            R.createdon, A.attachmentid,A.videotitle,A.videopath,
                            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                            WHERE R.recordid = $1;
                        `
                        return callServer(res,sql,[requestId]);
                    })
                    .catch(error => {
                        return Helper.displayMessage(res,500, error)
                    })
                }else{

                    return Helper.displayMessage(res,406, `can not perform action`)
                }
                
            }else{
               return Helper.displayMessage(res,404,'record not found')
            }
        })
        .catch(error => Helper.displayMessage(res,500, error))
        
        
        
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        return res.json({
            status: 400,
            error: "Invalid request"
        })
    }
    
    
}

export const updateComment = (req,res) => {
    let flagRecord = Helper.trimWhiteSpace(req.body);
    const {userid} = req.token;
    if(!Helper.validateKey(flagRecord,['comment'])){
        return Helper.displayMessage(res,400,'comment is required')
    }
    if(/^\d+$/.test(req.params.id)){
        const { comment } = flagRecord;
        const requestId = parseInt(req.params.id)
        let sql =   `SELECT * FROM BASE_REPORT WHERE recordid = $1 AND createdby = $2`;
        Helper.executeQuery(sql,[requestId, userid])
        .then(result => {
            if(result.rows.length){
                if(result.rows[0].status === IN_DRAFT){
                    let sql = `
                        UPDATE BASE_REPORT SET comment = $1 WHERE recordid = $2
                    `
                    Helper.executeQuery(sql,[comment, requestId])
                    .then(result => {
                        let sql = `
                            SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                            R.status,R.reportcategoryid, R.type,
                            R.createdon, A.attachmentid,A.videotitle,A.videopath,
                            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                            WHERE R.recordid = $1;
                        `
                        return callServer(res,sql,[requestId]);
                    })
                    .catch(error => {
                        return Helper.displayMessage(res,500, error)
                    })
                }else{

                    return Helper.displayMessage(res,406, `can not perform action`)
                }
                
            }else{
               return Helper.displayMessage(res,404,'record not found')
            }
        })
        .catch(error => Helper.displayMessage(res,500, error))
        
        
        
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        return res.json({
            status: 400,
            error: "Invalid request"
        })
    }
}

export const deleteRecord = (req,res) => {
    if(/^\d+$/.test(req.params.id)){
        const requestId = parseInt(req.params.id);
        let itemPos = -1;
        const recordRequested = records.filter((item, pos) => {if(item.id === requestId){itemPos = pos;return true}});
        if(recordRequested.length > 0){
            records.splice(itemPos, 1);
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 200,
                data: [{
                    requestId,
                    message: 'red flag record has been deleted'
                }]
            })
        }else{
            res.statusCode = 404;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 404,
                error: "Record not found"
            })
        }
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.json({
            status: 400,
            error: "Invalid Id"
        })
    }
}


const callServer = (res, sql, params) => {
    if(typeof params.length !== 'undefined' && params.length > 0){
        Helper.executeQuery(sql,params)
        .then((result) => {
            if(!result.rows.length){
                res.statusCode = 404;
                res.setHeader('content-type', 'application/json');
                return res.json({
                    status: 404,
                    message: `record not found`
                })
            }
           const output = groupAttachment(result)
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 200,
                data: output
            })
        })
        .catch((error) => {
            return Helper.displayMessage(res,500,'Server error',error);
        })
    }else{
        Helper.executeQuery(sql)
        .then((result) => {
            if(!result.rows.length){
                res.statusCode = 404;
                res.setHeader('content-type', 'application/json');
                return res.json({
                    status: 404,
                    data: []
                })
            }
            const { rows } = result;
            const output = [];
            for(let i = 0; i < rows.length; i++){
                const {
                    recordid,comment,status,location,createdby,
                    createdon,type
                } = rows[i];
                let Videos = [];
                let Images = [];
                for(let k = 0; k < rows.length; k++){
                    if(rows[k].recordid === recordid){
                        const {imagetitle, videotitle,videopath,imagepath} = rows[k];
                        if(videopath !== null){
                            Videos.push({videopath,videotitle});
                        }
                        if(imagepath !== null){
                            Images.push({imagepath,imagetitle});
                        }
                        
                        
                    }
                }
                
                const array = output.filter(element => element.recordid === recordid )
                if(!array.length){
                    output.push({
                        recordid,
                        comment,
                        status,
                        location,
                        createdby,
                        createdon,
                        type,
                        Video:Videos,
                        Image: Images
                    })
                }
                
            }
            res.statusCode = 404;
            res.setHeader('content-type', 'application/json');
            return res.json({
                status: 404,
                message: `record not found`
            })
        })
        .catch((error) => {
            return Helper.displayMessage(res,500,'Server error',error);
        })
    }
    
    
}
const groupAttachment = (result) => {
    const { rows } = result;
    const output = [];
    for(let i = 0; i < rows.length; i++){
        const {
            recordid,comment,status,location,createdby,
            createdon,type
        } = rows[i];
        let Videos = [];
        let Images = [];
        for(let k = 0; k < rows.length; k++){
            if(rows[k].recordid === recordid){
                const {imagetitle, videotitle,videopath,imagepath} = rows[k];
                if(videopath !== null){
                    Videos.push({videopath,videotitle});
                }
                if(imagepath !== null){
                    Images.push({imagepath,imagetitle});
                }
                
                
            }
        }
        
        const array = output.filter(element => element.recordid === recordid )
        if(!array.length){
            output.push({
                recordid,
                comment,
                status,
                location,
                createdby,
                createdon,
                type,
                Video:Videos,
                Image: Images
            })
        }
        
    }
    return output;
}
const insertRecord = (res, recordid, comment, userid, location, type) => {
    const reportcategoryid = (type === RED_FLAG) ? 1 : 2
    let sql = `
        INSERT INTO BASE_REPORT(recordid,comment,createdby,status, location, reportcategoryid,type, createdon)
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
    `
    Helper.executeQuery(sql, [recordid, comment, userid, 'IN DRAFT',location, reportcategoryid, type, 'NOW()'])
    .then(result => {
        let sql = `
        SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
        R.status,R.reportcategoryid, R.type,
        R.createdon, A.attachmentid,A.videotitle,A.videopath,
        A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
         where R.recordid = $1;
        `
        Helper.executeQuery(sql, [recordid])
        .then((result) => {
            const output = groupAttachment(result)
            res.statusCode = 201;
            res.setHeader('content-type', 'application/json');
           return res.json({
                status: 201,
                data: [{
                    recordid,
                    message: 'Created Red-flag record',
                    report: output
                }]
            })
        })
        .catch(error => Helper.displayMessage(res,500,error))
    })
    .catch(error => Helper.displayMessage(res,500,error))
}