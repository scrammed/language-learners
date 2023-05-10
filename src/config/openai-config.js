import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-QeoL0c5CmZ1OMOTCmpVyJEO5",
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);
