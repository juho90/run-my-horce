import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("race")
    .setDescription("레이스를 시작합니다 (관리자만 가능)"),
  new SlashCommandBuilder()
    .setName("raceinfo")
    .setDescription("현재 레이스 정보를 조회합니다"),
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("디스코드 명령어 등록 중...");
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });
    console.log("명령어 등록 완료!");
  } catch (error) {
    console.error(error);
  }
})();
