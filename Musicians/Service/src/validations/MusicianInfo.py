from wtforms import (StringField, TextAreaField, IntegerField, BooleanField,
                     RadioField)
from wtforms.validators import InputRequired, Length
from flask_wtf import FlaskForm

class musicianInstrument(FlaskForm):
    _id = StringField("id", validators=[InputRequired(),
                                        ])
    fecha_nacimiento = StringField("date", validators=[InputRequired(),
                                                       Length(min=8, max=10)])
    email = StringField("email", validators=[InputRequired(),
                                             Length(min=8
                                                    )])
print (len("64151854e036763b1c55896d"))
