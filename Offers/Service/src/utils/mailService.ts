import { _URL_MAILER } from "../configuration/config";
import { ApplicantType, OrganizerType } from "../types/mail.types";


export const sendPostulated = (data : ApplicantType) => {
    try{
        fetch(`${_URL_MAILER}/mailer`,{
            method : "POST",
            body : JSON.stringify(data)
        }).then(res => res.json())
            .then(data => data)
            .catch(err => new Error(err));
    }
    catch(err){
        return err;
    }
}

export const sendOrganizer = (data : OrganizerType) => {
    try{
        fetch(`${_URL_MAILER}/mailer/organizer`,{
            method : "POST",
            body : JSON.stringify(data)
        }).then(res => res.json())
            .then(data => data)
            .catch(err => new Error(err));
    }
    catch(err){
        return err;
    }
}