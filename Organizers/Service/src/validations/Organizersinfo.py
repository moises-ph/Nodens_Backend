from marshmallow import Schema, fields

### Validacion redes sociales ###
class RedesSocialesField(Schema):
    nombre = fields.String(required=True)
    url = fields.String(required=True)
### Validacion de create Organizadores ###
class OrganizerSchemaCreate(Schema):
    IdAuth = fields.Integer(required=True)
    telefono = fields.String(required=True)
    nombre_empresa = fields.String(required=True)
    descripcion_empresa = fields.String(required=True)
    pais = fields.String(required=True)
    ciudad = fields.String(required=True)
    url_logo = fields.String(required=True)
    url_foto_perfil = fields.String(required=True)
    genero = fields.String(required=True)
    redes_sociales = fields.List(fields.Dict(),required=True)
### Validacion de update Organizadores ###
class OrganizerSchemaUpdate(Schema):
    IdAuth = fields.Integer(required=True)
    telefono = fields.String(required=False)
    nombre_empresa = fields.String(required=False)
    descripcion_empresa = fields.String(required=False)
    pais = fields.String(required=False)
    ciudad = fields.String(required=False)
    url_logo = fields.String(required=False)
    url_foto_perfil = fields.String(required=False)
    genero = fields.String(required=False)
    redes_sociales = fields.List(fields.Dict(),required=False)