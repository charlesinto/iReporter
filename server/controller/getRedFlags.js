
const records = [
    {
        "id": 12,
        "createdOn":"23rd Dec, 2018",
        "createdBy":342,
        "type":"red-flag",
        "location":"",
        "status":"draft",
        "Images": [],
        "Videos":[],
        "comment":"london bridge is falling",
    },
    {
        "id": 13,
        "createdOn":"23rd Dec, 2018",
        "createdBy":3421,
        "type":"red-flag",
        "location":"",
        "status":"draft",
        "Images": [],
        "Videos":[],
        "comment":"london bridge is falling",
    },
    {
        "id": 14,
        "createdOn":"23rd Dec, 2018",
        "createdBy":342,
        "type":"red-flag",
        "location":"",
        "status":"draft",
        "Images": [],
        "Videos":[],
        "comment":"london bridge is falling",
    },
    {
        "id": 15,
        "createdOn":"23rd Dec, 2018",
        "createdBy":342,
        "type":"red-flag",
        "location":"",
        "status":"draft",
        "Images": [],
        "Videos":[],
        "comment":"london bridge is falling",
    },{
        "id": 16,
        "createdOn":"23rd Dec, 2018",
        "createdBy":3420,
        "type":"red-flag",
        "location":"",
        "status":"draft",
        "Images": [],
        "Videos":[],
        "comment":"london bridge is falling",
    },
    {
        "id": 17,
        "createdOn":"23rd Dec, 2018",
        "createdBy":342,
        "type":"red-flag",
        "location":"",
        "status":"draft",
        "Images": [],
        "Videos":[],
        "comment":"london bridge is falling",
    }
]

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
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.json({
            status: 200,
            data: selectedRecord
        })
    }
    
}

export const postRecord = (req,res) => {
    let flagRecord = req.body;
    if(typeof flagRecord !== 'undefined'){
        if((typeof flagRecord.comment !== 'undefined' && flagRecord.comment !== '') && (typeof flagRecord.createdBy !== 'undefined')){
            const id = records.length + 20;
            const newflagRecord = {createdOn:flagRecord.createdOn, createdBy: flagRecord.createdOn,type:flagRecord.type,location:flagRecord.location,status:flagRecord.status,Images:flagRecord.Images,Videos:flagRecord.Videos,comment:flagRecord.comment, id}
            records.push(newflagRecord);
            res.statusCode = 201;
            res.setHeader('content-type', 'application/json');
            res.json({
                status: 201,
                data: [{
                    id,
                    message: 'Created Red-flag record'
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
            if(recordRequested.length > 0){
                records.forEach(record => {
                    if(record.id === requestId){
                        record.location = flagRecord.location
                    }
                })
                res.statusCode = 202;
                res.setHeader('content-type', 'application/json');
                res.json({
                    status: 202,
                    data: [{
                        requestId,
                        message: 'Updated Red-flag\'s record location'
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