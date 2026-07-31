// OpenNext 生成的 .open-next/worker.js 只导出 fetch（+ 缓存层的 Durable Object 类）。
// 本文件包一层入口 worker —— 复用生成的 fetch，并把 wrangler 的 main 指向本文件。
// 纯个人使用：未启用任何 scheduled（每日榜单抓取 cron 已停用），无需 scheduled 处理器。

// @ts-ignore .open-next/worker.js 在 `opennextjs-cloudflare build` 时生成
import { default as handler } from "./.open-next/worker.js";

export default {
	fetch: handler.fetch,
} satisfies ExportedHandler<CloudflareEnv>;

// 再导出生成 worker 的 Durable Object 类（OpenNext 缓存层用；全量再导出以兼容后续启用缓存）。
// @ts-ignore .open-next/worker.js 在 build 时生成
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
