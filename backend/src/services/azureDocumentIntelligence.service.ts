import {
  DocumentAnalysisClient,
  AzureKeyCredential
} from "@azure/ai-form-recognizer";
import fs from "fs";

const endpoint = process.env.AZURE_DI_ENDPOINT!;
const key = process.env.AZURE_DI_KEY!;

const client = new DocumentAnalysisClient(
  endpoint,
  new AzureKeyCredential(key)
);

export const parsePdfWithAzureDI = async (filePath: string) => {
  const fileBuffer = fs.readFileSync(filePath);

  const poller = await client.beginAnalyzeDocument(
    "prebuilt-layout",
    fileBuffer
  );

  const result = await poller.pollUntilDone();

  return result;
};
