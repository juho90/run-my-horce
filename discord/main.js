import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { producer } from "./kafka-producer.js";
import { KAFKA_TOPICS } from "./kafka-topic.js";
import { logMessageSummaryAsync } from "./logMessageSummary.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const CORE_API = process.env.CORE_API || "http://localhost:3000/api";

client.on("ready", () => {
  console.log(`[디스코드 봇] 로그인됨: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  console.log(`[메시지 수신] ${message.author.tag}: ${message.content}`);
});

client.on("interactionCreate", async (interaction) => {
  console.log("interactionCreate 이벤트 진입:", interaction.commandName);
  if (!interaction.isChatInputCommand()) {
    console.log("interactionCreate 이벤트: 채팅 입력 명령이 아님");
    return;
  }
  if (interaction.commandName === "race") {
    if (!interaction.member?.permissions.has("Administrator")) {
      await interaction.reply("이 명령어는 서버 관리자만 사용할 수 있습니다.");
      return;
    }
    await interaction.reply(
      "레이스 시작을 요청했습니다. 잠시만 기다려주세요..."
    );
    // Kafka로 레이스 시작 메시지 발행
    await producer.connect();
    await producer.send({
      topic: KAFKA_TOPICS.START_RACE,
      messages: [{ value: JSON.stringify({}) }],
    });
    // 잠시 후 최신 레이스 정보 조회 (HTTP GET)
    setTimeout(async () => {
      const res = await fetch(`${CORE_API}/race/latest`);
      const race = await res.json();
      if (race && race.id) {
        await logMessageSummaryAsync(
          interaction.editReply(
            `레이스가 시작되었습니다! ID: ${race.id}, 상태: ${race.state}`
          )
        );
      } else {
        await logMessageSummaryAsync(
          interaction.editReply("레이스 시작에 실패했습니다.")
        );
      }
    }, 1000);
  }
  if (interaction.commandName === "raceinfo") {
    const res = await fetch(`${CORE_API}/race/latest`);
    const race = await res.json();
    if (race && race.id) {
      await interaction.reply(
        `현재 레이스 ID: ${race.id}, 상태: ${race.state}`
      );
    } else {
      await interaction.reply("진행 중인 레이스가 없습니다.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
