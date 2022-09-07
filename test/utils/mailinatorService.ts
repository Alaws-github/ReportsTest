import { REG_EMAIL_VERIFICATION_LINK } from "../data/constants"
import { MailinatorClient, GetInboxRequest, GetMessageRequest } from 'mailinator-client'


const setUpMailinator = async () => {
    const mailinatorClient = await new MailinatorClient(process.env.MAILINATOR_API_TOKEN);
    return mailinatorClient;
}

export const getMessage = async (emailWithoutDomain) => {

    const mailinatorClient = await setUpMailinator();

    const response = await mailinatorClient.request(
        await new GetInboxRequest(process.env.MAILINATOR_DOMAIN, emailWithoutDomain)
    );
    const response2 = await mailinatorClient.request(
        await new GetMessageRequest(process.env.MAILINATOR_DOMAIN, response.result.msgs[0].to, response.result.msgs[0].id)
    );

    return response2;

}

export const getConfirmationUrl = async (emailWithoutDomain) => {

    const response2 = await getMessage(emailWithoutDomain)
    let inboxBody = await response2.result.parts[0].body
    let linkUrlList = await inboxBody.match(REG_EMAIL_VERIFICATION_LINK);
    let confirmationUrl = await linkUrlList[1];
    return confirmationUrl;

}