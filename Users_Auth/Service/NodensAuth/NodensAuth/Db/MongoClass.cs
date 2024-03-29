﻿using MongoDB.Bson;
using MongoDB.Driver;

namespace NodensAuth.Db
{
    public class MongoClass
    {
        public class SourceRequest
        {
            public int? UserId { get; set; }
            public string EncodedId { get; set; }
            public bool Verified { get; set; }
        }
        public class RequestModel
        {
            public SourceRequest source { get; set; }
            public string email { get; set; }
            public BsonDateTime timestamp { get; set; }
        }

        public class SourceVerify
        {
            public string? email { get; set; }
            public string unique_str { get; set; }
        }

        public class VerifyUsersModel
        {
            public SourceVerify source { get; set; }
            public BsonDateTime timestamp { set; get; }
        }

        private readonly string _connection;
        public IMongoCollection<RequestModel> ClientRequest { get; private set; }
        public IMongoCollection<VerifyUsersModel> VerifyUsers { get; private set; }
        public MongoClass(string connString)
        {
            var db = new MongoClient(connString).GetDatabase("Nodens_RecVerify");
            ClientRequest = db.GetCollection<RequestModel>("Requests");
            VerifyUsers = db.GetCollection<VerifyUsersModel>("VerifyUsers");
        }
    }
}
