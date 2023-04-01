using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace NodensAuth.Validations
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    sealed public class CustomValidationRol : ValidationAttribute
    {
        readonly string _rol1;
        readonly string _rol2;

        public string Rol1
        {
            get { return _rol1; }
        }

        public string Rol2
        {
            get { return _rol2; }
        }

        public CustomValidationRol(string rol1, string rol2)
        {
            _rol1 = rol1;
            _rol2 = rol2;
        }

        public override bool IsValid(object? value)
        {
            var rolIn = (string)value;
            bool result = true;
            if (rolIn != null)
            {
                result = rolIn == this.Rol1 || rolIn == this.Rol2;
            }
            return result;
        }

        public override string FormatErrorMessage(string name)
        {
            return String.Format(CultureInfo.CurrentCulture,
              ErrorMessageString, name, this.Rol1, this.Rol2);
        }

    }
}
