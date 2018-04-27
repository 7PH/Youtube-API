import {ServiceOptions} from "googleapis/build/src/lib/api";
import {Youtube} from "googleapis/build/src/apis/youtube/v3";
import * as gapis from "googleapis";

export class YoutubeAPI extends Youtube {

    constructor(auth: string) {
        super({
            version: 'v3',
            auth: auth
        } as ServiceOptions, gapis.google);
    }


    public async getAllPlaylistVideoIds(playlistId: string, nextPageToken?: string): Promise<string[]> {
        // videos of this page
        let videos: string[];

        // get this page's result
        let result: any = await this.playlistItems.list({
            part: 'contentDetails',
            playlistId: playlistId,
            pageToken: nextPageToken
        });

        // retrieve the video ids
        videos = result.data.items.map((e: any) => e.contentDetails.videoId);

        // return the result, or the concatenated result if there are next pages
        if (typeof result.data.nextPageToken === "string") {
            // there are next pages
            let next: string[] = await this.getAllPlaylistVideoIds(playlistId, result.data.nextPageToken);
            return videos.concat(next);
        } else {
            // there is no next page
            return videos;
        }
    }
}