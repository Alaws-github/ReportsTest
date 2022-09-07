
import { notification, message } from 'antd';


export const Message = (type, msg) => {
    message[type](msg);
}

export const Notification = (type, description, message) => {
    notification[type]({
        message: message,
        description: description,
    });
};

