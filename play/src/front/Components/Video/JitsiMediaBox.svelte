<script lang="ts">
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import { Color } from "@workadventure/shared-utils";
    import { embedScreenLayoutStore } from "../../Stores/EmbedScreensStore";

    import { isMediaBreakpointUp } from "../../Utils/BreakpointsUtils";
    import { LayoutMode } from "../../WebRtc/LayoutManager";
    import { JitsiTrackWrapper } from "../../Streaming/Jitsi/JitsiTrackWrapper";
    import microphoneOffImg from "../images/microphone-off.png";

    import { EmbedScreen, highlightedEmbedScreen } from "../../Stores/HighlightedEmbedScreenStore";
    import { Streamable } from "../../Stores/StreamableCollectionStore";
    import SoundMeterWidgetWrapper from "../SoundMeterWidgetWrapper.svelte";
    import UserTag from "./UserTag.svelte";

    export let clickable = false;
    export let peer: JitsiTrackWrapper;

    let videoTrackStore = peer.videoTrack;
    let audioTrackStore = peer.audioTrack;

    let embedScreen: EmbedScreen;
    let videoContainer: HTMLDivElement;
    let videoElement: HTMLVideoElement;
    let audioElement: HTMLAudioElement;
    //let minimized: boolean;
    let isMobile: boolean;

    let backGroundColor = Color.getColorByString(peer.spaceUser?.name ?? "");
    let textColor = Color.getTextColorByBackgroundColor(backGroundColor);

    if (peer) {
        embedScreen = {
            type: "streamable",
            embed: peer as unknown as Streamable,
        };
    }

    const resizeObserver = new ResizeObserver(() => {
        //minimized = isMediaBreakpointOnly("md");
        isMobile = isMediaBreakpointUp("md");
    });

    onMount(() => {
        resizeObserver.observe(videoContainer);
        attachTrack();
    });

    afterUpdate(() => {
        attachTrack();
    });

    function attachTrack() {
        if ($audioTrackStore && !$audioTrackStore?.isLocal()) {
            $audioTrackStore?.attach(audioElement);
        }
        if ($videoTrackStore) {
            $videoTrackStore?.attach(videoElement);
        }
    }

    onDestroy(() => {
        peer.unsubscribe();
    });
</script>

<div
    id="container"
    class="jitsi-video"
    bind:this={videoContainer}
    on:click={() => (clickable ? highlightedEmbedScreen.toggleHighlight(embedScreen) : null)}
>
    {#if $videoTrackStore}
        <div class="tw-flex tw-w-full tw-flex-col tw-h-full tw-rounded-sm tw-overflow-hidden">
            <video
                bind:this={videoElement}
                class:object-contain={isMobile || $embedScreenLayoutStore === LayoutMode.VideoChat}
                class="tw-h-full tw-max-w-full tw-rounded-sm"
                autoplay
                playsinline
            />
        </div>
    {/if}
    <div class={`tw-absolute ${$videoTrackStore ? "tw-top-0.5 tw-right-2" : "tw-top-1 tw-right-3"}`}>
        {#if $audioTrackStore}
            <audio autoplay muted={false} bind:this={audioElement} />
            <SoundMeterWidgetWrapper
                classcss="voice-meter-cam-off tw-relative tw-mr-0 tw-ml-auto tw-translate-x-0 tw-transition-transform"
                barColor={$videoTrackStore ? "blue" : "black"}
                volume={peer.volumeStore}
            />
        {:else}
            <img
                draggable="false"
                src={microphoneOffImg}
                class="tw-flex tw-p-1 tw-h-8 tw-w-8 voice-meter-cam-off tw-relative tw-mr-0 tw-ml-auto tw-translate-x-0 tw-transition-transform"
                alt="Mute"
                class:tw-brightness-0={textColor === "black" && !$videoTrackStore}
                class:tw-brightness-100={textColor === "white" && !$videoTrackStore}
            />
        {/if}
    </div>
    {#if peer.spaceUser}
        {#await peer.spaceUser?.getWokaBase64()}
            <div />
        {:then wokaBase64}
            <UserTag
                isMe={$audioTrackStore?.isLocal() || $videoTrackStore?.isLocal()}
                name={peer.spaceUser?.name ?? ""}
                wokaSrc={wokaBase64}
                minimal={!!$videoTrackStore}
            />
        {/await}
    {/if}
</div>

<style lang="scss">
    /*    video.no-video {
        visibility: collapse;
    }*/
</style>
