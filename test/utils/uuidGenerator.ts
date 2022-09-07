/*
* This returns a UUID to be used to generate unique emails
*/
export const create_UUID = async () => {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (char == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
