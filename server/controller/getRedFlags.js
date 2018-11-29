
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