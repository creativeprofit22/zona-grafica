interface Document {
  readonly webkitFullscreenElement?: Element | null;
}

interface HTMLVideoElement {
  webkitEnterFullscreen?(): void;
}
