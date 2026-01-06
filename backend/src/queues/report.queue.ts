import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const REPORT_QUEUE_NAME = "report-processing";

export const reportQueue = new Queue(REPORT_QUEUE_NAME, {
  connection: redisConnection
});
