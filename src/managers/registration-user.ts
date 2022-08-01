import {UserAccount, UserInputModel} from "../types/user.type";
import {emailAdapter} from "../adapters/email-adapter";


export const emailManager = {
    async sendEmailConfirmationMessage(registrationParams: UserAccount){
        const link = `To verify your email, go to <a href="https://somesite.com/confirm-email?code=${registrationParams.emailConfirmation.confirmationCode}">there</a>"`
        await emailAdapter.sendEmail(
            registrationParams.accountData.email,
            "Configuration of registration",
            `https://somesite.com/confirm-email?code=${registrationParams.emailConfirmation.confirmationCode}`,
            /*link*/)
    }
}

