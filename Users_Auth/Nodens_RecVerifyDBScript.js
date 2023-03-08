const conn = new Mongo("mongodb://localhost:27017");

db = conn.getDB("Nodens_RecVerify");

db.createCollection("Requests",{
    timeseries:{
        timeField : "timestamp",
        metaField : "source",
        granularity : "seconds"
    },
    expireAfterSeconds : 1800
});

db.createCollection("VerifyUsers",{
    timeseries:{
        timeField : "timestamp",
        metaField : "source",
        granularity : "seconds"
    },
    expireAfterSeconds : 3600
});