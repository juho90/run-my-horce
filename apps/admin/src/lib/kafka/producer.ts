import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "horse-admin",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

export const producer = kafka.producer();
