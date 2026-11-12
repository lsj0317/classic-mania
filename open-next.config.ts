// OpenNext(Cloudflare) 설정
// https://opennext.js.org/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 지금은 증분 캐시(ISR / fetch 캐시)를 쓰지 않는다.
// fetch(..., { next: { revalidate } }) 결과를 Worker 간에 캐싱하려면 R2 버킷을 만든 뒤
// 아래처럼 r2IncrementalCache를 켜고 wrangler.jsonc에 r2_buckets 바인딩을 추가한다.
// (https://opennext.js.org/cloudflare/caching)
//
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
// export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });

export default defineCloudflareConfig({});
