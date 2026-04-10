import ParaWeb, { Environment } from "@getpara/web-sdk";

const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY;

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_PARA_API_KEY is not set");
}

export const paraEnvironment = Environment.BETA;

export const paraClient = new ParaWeb(paraEnvironment, API_KEY);
