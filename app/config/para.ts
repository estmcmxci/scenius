import ParaWeb, { Environment } from "@getpara/web-sdk";

const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY ?? "";

export const paraEnvironment = Environment.BETA;

export const paraClient = new ParaWeb(paraEnvironment, API_KEY);
