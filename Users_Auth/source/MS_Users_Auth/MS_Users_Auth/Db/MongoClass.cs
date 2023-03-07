using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MS_Users_Auth.Db
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
        public MongoClass(IConfiguration config) 
        {
            _connection = config.GetConnectionString("CadenaMongo");
            ClientRequest = new MongoClient(_connection).GetDatabase("Nodens_RecPassword").GetCollection<RequestModel>("Requests");
            VerifyUsers = new MongoClient(_connection).GetDatabase("Nodens_RecPassword").GetCollection<VerifyUsersModel>("VerifyUsers");
        }
    }
}
