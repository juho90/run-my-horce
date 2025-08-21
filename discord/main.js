import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import {
  COMMAND_HORSEINFO,
  COMMAND_RACE,
  COMMAND_RACEINFO,
} from "./discord.commands.js";
import { producer } from "./kafka.producer.js";
import { KAFKA_TOPICS } from "./kafka.topic.js";
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
  console.log(`[디스코드 봇] 서버 수: ${client.guilds.cache.size}`);
  console.log(`[디스코드 봇] 준비 완료!`);
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
  if (interaction.commandName === COMMAND_RACE) {
    if (!interaction.member?.permissions.has("Administrator")) {
      await interaction.reply("이 명령어는 서버 관리자만 사용할 수 있습니다.");
      return;
    }
    await interaction.reply(
      "레이스 시작을 요청했습니다. 잠시만 기다려주세요..."
    );
    await producer.connect();
    await producer.send({
      topic: KAFKA_TOPICS.START_RACE,
      messages: [{ value: JSON.stringify({}) }],
    });
    setTimeout(async () => {
      const res = await fetch(`${CORE_API}/race/latest`);
      const race = await res.json();
      if (race && race.raceId) {
        await logMessageSummaryAsync(
          interaction.editReply(
            `레이스가 시작되었습니다! ID: ${race.raceId}, 상태: ${race.state}`
          )
        );
      } else {
        await logMessageSummaryAsync(
          interaction.editReply("레이스 시작에 실패했습니다.")
        );
      }
    }, 1000);
  } else if (interaction.commandName === COMMAND_RACEINFO) {
    const res = await fetch(`${CORE_API}/race/latest`);
    const race = await res.json();
    if (race && race.raceId) {
      await interaction.reply(
        `현재 레이스 ID: ${race.raceId}, 상태: ${race.state}`
      );
    } else {
      await interaction.reply("진행 중인 레이스가 없습니다.");
    }
  } else if (interaction.commandName === COMMAND_HORSEINFO) {
    const res = await fetch(`${CORE_API}/horses/latest`);
    const horses = await res.json();
    if (horses && horses.horseId) {
      const reply = horses.map(horseInfo).join("\n");
      await interaction.reply(reply);
    } else {
      await interaction.reply("진행 중인 경주마가 없습니다.");
    }
  }
});

client.on("error", (error) => {
  console.error("❌ 디스코드 클라이언트 오류:", error);
});

client.on("warn", (warning) => {
  console.warn("⚠️ 디스코드 클라이언트 경고:", warning);
});

function horseInfo(horse) {
  return `현재 경주마 ID: ${horse.horseId}, 이름: ${horse.name}, 주법: ${horse.runningStyle}, 파워: ${horse.strength}, 스태미나: ${horse.endurance}, 스피드: ${horse.agility}, 근성: ${horse.intelligence}, 정신력: ${horse.spirit}`;
}

client.login(process.env.DISCORD_TOKEN);
