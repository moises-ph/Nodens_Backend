import { _URL_MAILER } from "../configuration/config";
import { ApplicantType, OrganizerType } from "../types/mail.types";


export const sendPostulated = (data : ApplicantType) : Promise<any> => {
    return new Promise((res, rej)=>{
        try{
            fetch(`${_URL_MAILER}/mailer`,{
                method : "POST",
                body : JSON.stringify(data),
                headers : {
                    "content-type" : "application/json"
                }
            }).then(res => res.json())
                .then(data => res(data))
                .catch(err => new Error(err));
        }
        catch(err){
            rej(err);
        }
    })
}

export const sendOrganizer = (data : OrganizerType) : Promise<any> => {
    return new Promise((res, rej)=>{
        try{
            fetch(`${_URL_MAILER}/mailer/organizer`,{
                method : "POST",
                body : JSON.stringify(data),
                headers : {
                    "content-type" : "application/json"
                }
            }).then(res => res.json())
                .then(data => res(data))
                .catch(err => new Error(err));
        }
        catch(err){
            rej(err);
        }
    });
}