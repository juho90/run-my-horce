import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "horse-admin",
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();
