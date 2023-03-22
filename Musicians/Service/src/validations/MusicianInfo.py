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
    IdAuth = IntegerField(label="IdAuth")

    fecha_nacimiento = DateField(label="fecha_nacimiento", validators=[InputRequired()],format="%Y-%m-%d")

    email = EmailField(label="email", validators=[InputRequired(),Length(min=8)])

    instrumentos = FieldList(FormField(InstrumentosValidator),label="instrumentos")
    
    genero = StringField(label="genero", validators=[InputRequired()])
    
    pais = StringField(label="pais", validators=[InputRequired()])
    
    ciudad = StringField(label="ciudad", validators=[InputRequired()])
    
    experiencia = StringField(label="experiencia", validators=[InputRequired()])

    educacion = FieldList(FormField(EducacionValidator))

    url_foto_perfil = StringField(label="url_foto_perfil")

    url_video_presentacion = StringField(label="url_video_presentiacion")

    redes_sociales = FieldList(FormField(RedesSocialesValidator), label="redes_sociales")
