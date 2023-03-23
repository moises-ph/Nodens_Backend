using Microsoft.Extensions.Options;

namespace MS_Users_Auth.Utils
{
    public class EnvironmentConfig
    {
        public string CadenaSQL { get; set; }
        public string CadenaMongo { get; set; }
        public string APPURL { get; set; }
    }
}
