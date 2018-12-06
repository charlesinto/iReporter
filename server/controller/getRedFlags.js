import { records } from '../model';

export const getRedFlags = (req, res) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.json({
        status: 200,
        data: records
    })
}

export const getARecord = (req,res) => {
    if(/^\d+$/.test(req.params.id)){
        const flagId = parseInt(req.params.id)
        const selectedRecord = records.filter(record => record.id === flagId);
        if(selectedRecord.length > 0){
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 200,
                report: selectedRecord
            })
        }else{
            res.statusCode = 404;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 404,
                message: `REQUEST ID NOT FOUND`
            })
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