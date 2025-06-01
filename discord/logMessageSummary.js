export function logMessageSummary(msg, label = "메시지 요약") {
  if (!msg) {
    console.log(`[${label}] 메시지 없음`);
    return;
  }
  console.log(`[${label}] ${msg}`);
}

export async function logMessageSummaryAsync(msg, label = "메시지 요약") {
  try {
    const result = await msg;
    logMessageSummary(result, label);
  } catch (error) {
    console.error(`[${label}] Error:`, error);
  }
}
