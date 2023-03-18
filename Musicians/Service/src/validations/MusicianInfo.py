from wtforms import (StringField, EmailField, FieldList, FormField,
                     RadioField, DateField)
from wtforms.validators import InputRequired, Length
from flask_wtf import FlaskForm

class InstrumentValidator(FlaskForm):
    nombre = StringField("Nombre instrumento", validators=InputRequired())
    nivel = StringField("Nivel en el instrumentioo", validators=InputRequired())

class musicianInstrument(FlaskForm):
    _id = StringField("id", validators=[InputRequired(),
                                        ])
    fecha_nacimiento = DateField("date", validators=[InputRequired()
                                                       ])
    email = EmailField("email", validators=[InputRequired(),
                                             Length(min=8)
                                             ])
    instrumentos = FieldList("instrument",
                               validators=[InputRequired(), 
                                           FormField(InstrumentValidator)])
    
    genero = StringField("genero", validators=[InputRequired()
                                               ])
    pais = StringField("pais", validators=[InputRequired()
                                           ])
    ciudad = StringField("ciudad", validators=[InputRequired()
                                               ])
    experiencia = StringField("experiencia", validators=[InputRequired()
                                                         ])
    educacion = StringField("educacion",)
print (len("64151854e036763b1c55896d"))
