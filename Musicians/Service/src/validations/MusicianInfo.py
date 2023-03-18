from wtforms import (StringField, TextAreaField, IntegerField, BooleanField,
                     RadioField)
from wtforms.validators import InputRequired, Length

class musicianInstrument:
    def __init__(self) -> None:
        pass

class musicianinfo:
    def __init__(self, name, email, years):
        self.name = name
        self.email = email
        self.years = years
        
    def toDBCollection(self):
        return{
            "name": self.name,
            "email": self.email,
            "years": self.years
        }