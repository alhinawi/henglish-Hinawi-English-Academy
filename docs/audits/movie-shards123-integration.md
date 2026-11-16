# Bounded learning scenes

2026-11-16: The owner chose very short scenes rather than a complete source video with gaps in the displayed script. The scene player now loads an explicit start/end window. Source uploads are not hosted or copied.

- Godfather: only 0-4.8 seconds, with the complete reviewed opening. The old later excerpts are not played or presented as this scene's script.
- Eight other source sets have one short contiguous caption block each. Its ENTIRE supplied caption text is shown with Egyptian Arabic and optional formal Arabic, within 90 English characters per source. The full block's original caption bounds are used. These are caption-timed, not waveform-verified cuts. No complete-source-transcript claim.
- 277 source IDs remain held. Weak matching, garbled ASR, incomplete fragments and disconnected excerpts do not become complete scenes. All 300 catalog entries / 286 source IDs are retained. Held sources expose no player or study text, including saved/history/direct inputs.
- The strict gate requires completeSceneTranscript, positive source duration, scene bounds, full contiguous text coverage, per-cue source/bounds evidence, exact selected caption text, <=90 English characters across the scene and score >=0.8. A reviewStatus flag or fuzzy score alone never enables a source.

The other returned caption samples remain private research, not a release of 160 greeting-only scenes. The shard 4-5 evidence has not been promoted. More clean contiguous segments need selection and sound checks, not bulk import.

The player uses YouTube's loadVideoById object form with decimal startSeconds/endSeconds on every replay/cue tap. seekTo is not used because YouTube documents that it clears endSeconds. A 50ms source-clock boundary guard also pauses out-of-range native scrubbing. YouTube seeking is keyframe-based; these controls are not a frame-accurate media editor. Native CC requests English when available, but language availability and caption accuracy are not guaranteed. The source remains linked.

Portrait: pinned video and compact controls; script has its own scroll area below. Landscape/desktop: video and script side by side. Active cues highlight and smoothly center inside their own list. Cue follow is automatic with no Follow button. Repeat loops the selected caption block (or the bounded scene if no block is active). The speed button opens supported 0.5x/0.75x/1x/1.25x choices. Holding it for 350ms temporarily slows playback, restoring the selected rate on release, cancel, blur, or hidden tab. A default-on setting is saved locally. Reduced-motion preference is respected.

Checks: structural gate, TypeScript, Arabic lint, production build, source preservation, bounds/load/replay/native-drag behavior, active cue highlight, automatic follow, repeat at clock bounds/native ENDED, speed selection, hold/release/blur restoration, default-on and saved disabled hold settings, held-data and stale-cache checks; local 390px portrait and 844x390 landscape screenshots. Local timing/layout checks use a deterministic YouTube API stand-in; they do not certify live playback or frame-accurate cuts. Parent owns deployment and live verification.

API source: https://developers.google.com/youtube/iframe_api_reference
Player parameters: https://developers.google.com/youtube/player_parameters
