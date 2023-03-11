const connection = new Mongo("mongodb://localhost:27017");

db = connection.getDB("Nodens_Posts");

db.createCollection("Posts",{
    validator:{
        $jsonSchema : {
            bsonType : "object",
            title : "Posts Object Validation",
            required : ["user_id", "title", "content", "date", "likes", "comments"],
            properties :{
                user_id:{
                    bsonType : "objectId",
                    description : "El Usuario debe tener una identificación válida"
                },
                date:{
                    bsonType : "date",
                    description : "Fecha inválida"
                },
                comments :{
                    bsonType : "array"
                },
                likes : {
                    bsonType : "int",
                    description : "Likes deben ser un número"
                },
                content : {
                    bsonType : "object",
                    properties : {
                        text : {
                            bsonType : "string",
                            description : "Texto del post no válido"
                        },
                        links : {
                            bsonType : "array"
                        },
                        images : {
                            bsonType : "array"
                        }
                    }
                }
            }
        }
    }
});