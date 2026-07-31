"use client";

import DirectDownloadBadge from "./DirectDownloadBadge";
import type { DownloadStrings } from "@/lib/buy/content";

// 纯个人使用：直接提供官网 APK 下载，不再按访客地区区分 Google Play / 官网。
export default function AndroidBadge({
	strings,
	className = "",
}: {
	strings: DownloadStrings;
	className?: string;
}) {
	return (
		<DirectDownloadBadge
			topLabel={strings.directTop}
			mainLabel={strings.directMain}
			alt={strings.directAlt}
			className={className}
		/>
	);
}
