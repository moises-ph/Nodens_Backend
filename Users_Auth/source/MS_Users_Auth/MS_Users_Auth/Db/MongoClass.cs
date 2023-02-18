using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MS_Users_Auth.Db
{
    public class MongoClass
    {
        public class Source
        {
            public int? UserId { get; set; }
            public string EncodedId { get; set; }
        }
        public class RequestModel
        {
            public Source source { get; set; }
            public string email { get; set; }
            public BsonDateTime timestamp { get; set; }
        }
        private readonly string _connection;
        public IMongoCollection<RequestModel> ClientRequest { get; private set; }
        public MongoClass(IConfiguration config) 
        {
            _connection = config.GetConnectionString("CadenaMongo");
            ClientRequest = new MongoClient(_connection).GetDatabase("Nodens_RecPassword").GetCollection<RequestModel>("Requests");
        }
    }
}
