from marshmallow import Schema, fields

class InstrumentsField(Schema):
    nombre = fields.String(required=True)
    nivel = fields.String(required=True)

class EducacionField(Schema):
    nombre = fields.String(required=True)
    institucion = fields.String(required=True)
    fecha_inicio = fields.Date(required=True)
    fecha_fin = fields.Date(required=True)

class RedesSocialesField(Schema):
    nombre = fields.String(required=True)
    url = fields.String(required=True)

class MusicianSchemaCreate(Schema):
    IdAuth = fields.Integer(required=True)
    fecha_nacimiento = fields.Date(required=True)
    instrumentos = fields.List(fields.Dict(),required=True)
    generosMusicales = fields.List(fields.String(),required=True)
    pais = fields.String(required=True)
    ciudad = fields.String(required=True)
    experiencia = fields.String(required=True)
    educacion = fields.List(fields.Dict(),required=True)
    url_foto_perfil = fields.String(required=True)
    url_video_presentacion = fields.String(required=True)
    redes_sociales = fields.List(fields.Dict(),required=True)

class MusicianSchemaUpdate(Schema):
    IdAuth = fields.Integer(required=True)
    fecha_nacimiento = fields.Date(required=False)
    instrumentos = fields.List(fields.Dict(), required=False)
    generosMusicales = fields.List(fields.String(), required=False) 
    pais = fields.String(required=False)
    ciudad = fields.String(required=False)
    experiencia = fields.String(required=False)
    educacion = fields.List(fields.Dict(), required=False)
    url_foto_perfil = fields.String(required=False)
    url_video_presentacion = fields.String(required=False)
    redes_sociales = fields.List(fields.Dict(), required=False)