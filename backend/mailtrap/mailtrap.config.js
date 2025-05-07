import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";


const TOKEN = "1ddc81ca3cc7f9d69724341e31a86a69";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};