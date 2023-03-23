from marshmallow import Schema, fields

class InstrumentsField(Schema):
    nombre = fields.String()
    nivel = fields.String()

class EducacionField(Schema):
    nombre = fields.String()
    institucion = fields.String()
    fecha_inicio = fields.Date()
    fecha_fin = fields.Date()

class RedesSocialesField(Schema):
    nombre = fields.String()
    url = fields.String()

class MusicianSchemaCreate(Schema):
    IdAuth = fields.Integer()
    fecha_nacimiento = fields.Date()
    instrumentos = fields.List(fields.Dict())
    generos = fields.List(fields.String()) 
    pais = fields.String()
    ciudad = fields.String()
    experiencia = fields.String()
    educacion = fields.List(fields.Dict())
    url_foto_perfil = fields.String()
    url_video_presentacion = fields.String()
    redes_sociales = fields.List(fields.Dict())

class MusicianSchemaUpdate(Schema):
    IdAuth = fields.Integer(required=True)
    fecha_nacimiento = fields.Date(required=False)
    instrumentos = fields.List(fields.Dict(), required=False)
    generos = fields.List(fields.String(), required=False) 
    pais = fields.String(required=False)
    ciudad = fields.String(required=False)
    experiencia = fields.String(required=False)
    educacion = fields.List(fields.Dict(), required=False)
    url_foto_perfil = fields.String(required=False)
    url_video_presentacion = fields.String(required=False)
    redes_sociales = fields.List(fields.Dict(), required=False)