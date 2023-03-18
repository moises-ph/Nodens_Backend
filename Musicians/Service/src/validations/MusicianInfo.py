from wtforms import (StringField, TextAreaField, IntegerField, BooleanField,
                     RadioField)
from wtforms.validators import InputRequired, Length, ValidationError
from wtforms import validators
from flask_wtf import FlaskForm

class InstrumentValdator(FlaskForm):
    nombre = StringField("Nombre instrumento", validators=InputRequired())
    nivel = StringField("Nivel en el instrumentioo", validators=InputRequired())


def validatorInstrumentos(form):
    if type(form) != "list":
        raise ValidationError('Instruments must be a list')
    else:
        for element in form:
            if not InstrumentValdator.validate(element):
                raise ValidationError("Información de instrumento no válida")

class musicianInstrument(FlaskForm):
    _id = StringField("id", validators=[InputRequired(),
                                        ])
    fecha_nacimiento = StringField("date", validators=[InputRequired(),
                                                       Length(min=8, max=10)
                                                       ])
    email = StringField("email", validators=[InputRequired(),
                                             Length(min=8)
                                             ])
    instrumentos = StringField("instrument",
                               validators=[InputRequired(), 
                                           validatorInstrumentos])
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
