using MongoDB.Driver;
using MongoDB.Bson;

namespace MS_Users_Auth.Db
{
    public class MongoClass
    {
        private readonly string _connection;
        public static MongoClient Client { get; private set; }
        public MongoClass(IConfiguration config) 
        {
            _connection = config.GetConnectionString("CadenaMongo");
            Client = new MongoClient(_connection);
        }

        public async bool CreateResetRequest(string email, int Id)
        {
            var _requestsCollection = Client.GetDatabase("Nodens_RecPassword").GetCollection<BsonDocument>("Requests");
            await _requestsCollection.InsertOneAsync(new { 
                source = {
                    ID = Id
                },
                Email = email
            });
        }
    }
}
