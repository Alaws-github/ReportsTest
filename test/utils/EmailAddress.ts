import { create_UUID } from './uuidGenerator'

export const createEmailAddress = async () => {
    let uuid = await create_UUID();
    let emailWithoutDomain = "test+" + uuid;
    let emailAddress = "test+" + uuid + "@qualitywatcher.testinator.com";
    return { emailWithoutDomain, emailAddress }
}