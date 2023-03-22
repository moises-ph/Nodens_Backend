from wtforms import StringField, EmailField, FieldList, IntegerField, DateField, FormField
from wtforms.validators import InputRequired, Length
from flask_wtf import FlaskForm

class InstrumentosValidator(FlaskForm):
    nombre = StringField("Nombre instrumento", validators=[InputRequired()])
    nivel = StringField("Nivel en el instrumentioo", validators=[InputRequired()])

class EducacionValidator(FlaskForm):
    nombre = StringField("Nombre del titulo", validators=[InputRequired()])
    institucion = StringField("Nombre de la Institución", validators=[InputRequired()])
    fecha_inicio = DateField("Fecha de inicio", validators=[InputRequired()],format="%Y-%m-%d")
    fecha_fin = DateField("Fecha de fin", validators=[InputRequired()],format="%Y-%m-%d")

class RedesSocialesValidator(FlaskForm):
    nombre = StringField("Red Social", validators=[InputRequired()])
    url = StringField("Url del perfil en red social", validators=[InputRequired()])

class musicianInstrument(FlaskForm):
    IdAuth = IntegerField("Id in Auth Service")

    fecha_nacimiento = DateField("date", validators=[InputRequired()],format="%Y-%m-%d")

    email = EmailField("email", validators=[InputRequired(),Length(min=8)])

    instrumentos = FieldList(FormField(InstrumentosValidator))
    
    genero = StringField("genero", validators=[InputRequired()])
    
    pais = StringField("pais", validators=[InputRequired()])
    
    ciudad = StringField("ciudad", validators=[InputRequired()])
    
    experiencia = FieldList(FormField(EducacionValidator))

    educacion = StringField("educacion",)

    url_foto_perfil = StringField("Foto de perfil")

    url_video_presentacion = StringField("Foto de perfil")

    redes_sociales = FieldList(FormField(RedesSocialesValidator))

print (len("64151854e036763b1c55896d"))
