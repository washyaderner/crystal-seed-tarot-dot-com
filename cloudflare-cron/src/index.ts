export default {
  async scheduled(
    event: ScheduledEvent,
    env: { CRON_SECRET: string },
    ctx: ExecutionContext
  ) {
    const res = await fetch("https://crystalseedtarot.com/api/cron/scan", {
      headers: { Authorization: `Bearer ${env.CRON_SECRET}` },
    });
    console.log(`Scan triggered: ${res.status}`);
  },
};
