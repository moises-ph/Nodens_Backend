"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrganizer = exports.sendPostulated = void 0;
const config_1 = require("../configuration/config");
const sendPostulated = (data) => {
    try {
        fetch(`${config_1._URL_MAILER}/mailer`, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(data => data)
            .catch(err => new Error(err));
    }
    catch (err) {
        return err;
    }
};
exports.sendPostulated = sendPostulated;
const sendOrganizer = (data) => {
    try {
        fetch(`${config_1._URL_MAILER}/mailer/organizer`, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(data => data)
            .catch(err => new Error(err));
    }
    catch (err) {
        return err;
    }
};
exports.sendOrganizer = sendOrganizer;
