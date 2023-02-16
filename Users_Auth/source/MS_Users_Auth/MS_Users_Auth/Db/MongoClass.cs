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
            Client.GetDatabase("Nodens_RecPassword");
        }
    }
}
