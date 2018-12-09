import { records } from '../model';
import Helper from '../Helper';
import {SUPER_ADMINISTRATOR, USER_ROLE, RED_FLAG} from '../types';

export const getRedFlags = (req, res) => {
    // res.statusCode = 200;
    // res.setHeader('content-type', 'application/json');
    // res.json({
    //     status: 200,
    //     data: records
    // })
    if(req.token){
        const user = req.token;
        const {rolename, userid} = user;
        if(rolename === SUPER_ADMINISTRATOR){
            let sql =
            `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
            WHERE R.type = $1`;
           return callServer(res,sql,[RED_FLAG])

        }
        else if(rolename == USER_ROLE){
            let sql =
            `SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
            R.status,R.reportcategoryid, R.type,
            R.createdon, A.attachmentid,A.videotitle,A.videopath,
            A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
             where R.type = $1 AND R.createdby = $2`;
           return  callServer(res,sql,[RED_FLAG, userid])
        }
    }
}

export const getARecord = (req,res) => {
    if(/^\d+$/.test(req.params.id)){
        const flagId = parseInt(req.params.id)
        // const selectedRecord = records.filter(record => record.id === flagId);
        // if(selectedRecord.length > 0){
        //     res.statusCode = 200;
        //     res.setHeader('content-type', 'application/json');
        //     res.json({
        //         status: 200,
        //         report: selectedRecord
        //     })
        // }else{
        //     res.statusCode = 404;
        //     res.setHeader('content-type', 'application/json');
        //     res.json({
        //         status: 404,
        //         message: `REQUEST ID NOT FOUND`
        //     })
        // }
        if(req.token){
            const {rolename, userid} = req.token;
            if(rolename === SUPER_ADMINISTRATOR){
                let sql = `
                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where R.type = $1 AND R.recordid = $2
                `
                return callServer(res,sql,[RED_FLAG, flagId])
            }
            else if (rolename === USER_ROLE){
                let sql = `
                SELECT R.id,R.recordid,R.comment,R.createdby,R.location,
                R.status,R.reportcategoryid, R.type,
                R.createdon, A.attachmentid,A.videotitle,A.videopath,
                A.imagetitle,A.imagepath FROM BASE_REPORT R LEFT OUTER JOIN BASE_ATTACHMENT A ON R.recordid = A.recordid
                 where (R.type = $1 AND R.recordid = $2) AND R.createdby = $3
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
    let flagRecord = req.body;
    if(typeof flagRecord !== 'undefined'){
        if((typeof flagRecord.comment !== 'undefined' && flagRecord.comment !== '') && (typeof flagRecord.createdBy !== 'undefined')){
            const id = records.length + 20;
            const { createdOn,createdBy,type,location, status, Images, Videos, comment } = flagRecord
            const newflagRecord = {createdOn, createdBy,type, location, status, Images, Videos, id}
            records.push(newflagRecord);
            res.statusCode = 201;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 201,
                data: [{
                    id,
                    message: 'Created Red-flag record',
                    report: newflagRecord
                }]
            })
        }else{
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 400,
                error: "comment or createdBy is required"
            })
        }
    }
    else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.json({
            status: 400,
            error: "request is undefined"
        })
    }
}

export const updateLocation = (req, res) => {
    let flagRecord = req.body;
    if((typeof flagRecord !== 'undefined' && typeof flagRecord.location !== 'undefined') && flagRecord.location !== ' ' ){
        if(/^\d+$/.test(req.params.id)){
            const requestId = parseInt(req.params.id)
            const recordRequested = records.filter(item => item.id === requestId);
            let data = {};
            if(recordRequested.length > 0){
                records.forEach(record => {
                    if(record.id === requestId){
                        record.location = flagRecord.location
                        data = record
                    }
                })
                res.statusCode = 202;
                res.setHeader('content-type', 'application/json');
                res.json({
                    status: 202,
                    data: [{
                        requestId,
                        message: 'Updated Red-flag\'s record location',
                        report: data
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
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.json({
            status: 400,
            error: "Invalid request"
        })
    }
    
}

export const updateComment = (req,res) => {
    let flagRecord = req.body;
    if((typeof flagRecord !== 'undefined' && typeof flagRecord.comment !== 'undefined') && flagRecord.comment !== ' ' ){
        if(/^\d+$/.test(req.params.id)){
            const requestId = parseInt(req.params.id)
            const recordRequested = records.filter(item => item.id === requestId);
            let data = {};
            if(recordRequested.length > 0){
                records.forEach(record => {
                    if(record.id === requestId){
                        record.comment = flagRecord.comment;
                        data = record;
                    }
                })
                res.statusCode = 202;
                res.setHeader('content-type', 'application/json');
                res.json({
                    status: 202,
                    data: [{
                        requestId,
                        message: 'Updated Red-flag\'s record comment',
                        report: data
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
    }else{
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        res.json({
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