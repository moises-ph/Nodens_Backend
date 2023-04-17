const connection = new Mongoose("mongodb://localhost:27017");

db = connection.getDB("Nodens_Offers");

db.createCollection("Offers", {
    validator :{
        $jsonSchema : {
            bsonType : "object",
            title : "Offers object Validation",
            required : ["Title", "Description", "Creation_Date", "Event_Date", "Payment", "OrganizerId", "Event_Ubication", "Requeriments", "Vacants"],
            properties : {
                OrganizerId : {
                    bsonType : "int",
                    description : "El organizador debe tener un id válido"
                },
                Title : {
                    bsonType : "string"
                },
                Description : {
                    bsonType : "string"
                },
                Creation_Date : {
                    bsonType : "date"
                },
                Event_Date : {
                    bsonType : "date"
                },
                Payment : {
                    bsonType : "int"
                },
                Event_Ubication : {
                    bsonType : "object",
                    required : ["City", "Town", "SiteNumber"],
                    properties : {
                        City : {
                            bsonType : "string",
                        },
                        Street : {
                            bsonType : ["null","string",]
                        },
                        Career : {
                            bsonType : ["null","string",]
                        },
                        SiteNumber : {
                            bsonType : "string"
                        },
                        Town : {
                            bsonType : ["null","string",]
                        }
                    }
                },
                Applicants : {
                    bsonType : ["null","array"]
                },
                Img : {
                    bsonType : ["null","string"]
                },
                Requeriments : {
                    bsonType : ["null","array"]
                },
                Vacants : {
                    bsonType : "int"
                },
                isAvailable : {
                    bsonType : "boolean"
                }
            }
        }
    }
});