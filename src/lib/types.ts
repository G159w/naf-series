import type { VideoType } from "@prisma/client";

export type movieDBVideo = {
	title: string
	movieDBUrl: string;
	imgUrl?: string;
	year?: string;
  type: VideoType
}