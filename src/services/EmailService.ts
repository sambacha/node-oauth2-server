import config from "config";
import htmlToText from "html-to-text";

import sgMail from "@sendgrid/mail";

import Logger from "@util/logger";

sgMail.setApiKey(config.get("sendgrid.key"));

export default class EmailService {
  /**
   * Send email messages
   * @param to
   * @param subject
   * @param content
   */
  public static async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    try {
      await sgMail.send({
        to,
        from: "accounts@wfiis.pl",
        subject,
        text: htmlToText.fromString(content),
        html: content,
      });
      return true;
    } catch (err) {
      Logger.log("error", "Error while sending EMail", { err });
      return false;
    }
  }
}
