"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrganizer = exports.sendPostulated = void 0;
const config_1 = require("../configuration/config");
const sendPostulated = (data) => {
    return new Promise((res, rej) => {
        try {
            fetch(`${config_1._URL_MAILER}/mailer`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "content-type": "application/json"
                }
            }).then(res => res.json())
                .then(data => res(data))
                .catch(err => new Error(err));
        }
        catch (err) {
            rej(err);
        }
    });
};
exports.sendPostulated = sendPostulated;
const sendOrganizer = (data) => {
    return new Promise((res, rej) => {
        try {
            fetch(`${config_1._URL_MAILER}/mailer/organizer`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "content-type": "application/json"
                }
            }).then(res => res.json())
                .then(data => res(data))
                .catch(err => new Error(err));
        }
        catch (err) {
            rej(err);
        }
    });
};
exports.sendOrganizer = sendOrganizer;
