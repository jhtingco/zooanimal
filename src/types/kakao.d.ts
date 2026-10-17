// Kakao Maps SDK Type Definitions
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        LatLngBounds: new () => KakaoLatLngBounds;
        Map: new (
          container: HTMLElement,
          options: {
            center: KakaoLatLng;
            level: number;
          }
        ) => KakaoMapInstance;
        Marker: new (options: {
          map?: KakaoMapInstance;
          position: KakaoLatLng;
          title?: string;
          image?: KakaoMarkerImage;
          clickable?: boolean;
        }) => KakaoMarker;
        MarkerImage: new (
          src: string,
          size: KakaoSize,
          options?: { offset?: KakaoPoint }
        ) => KakaoMarkerImage;
        Size: new (width: number, height: number) => KakaoSize;
        Point: new (x: number, y: number) => KakaoPoint;
        CustomOverlay: new (options: {
          map?: KakaoMapInstance;
          position: KakaoLatLng;
          content: HTMLElement | string;
          yAnchor?: number;
          xAnchor?: number;
          zIndex?: number;
        }) => KakaoCustomOverlay;
        InfoWindow: new (options: {
          content: HTMLElement | string;
          removable?: boolean;
          zIndex?: number;
        }) => KakaoInfoWindow;
        event: {
          addListener: (
            target: KakaoMapInstance | KakaoMarker | KakaoCustomOverlay,
            type: string,
            handler: () => void
          ) => void;
          removeListener: (
            target: KakaoMapInstance | KakaoMarker | KakaoCustomOverlay,
            type: string,
            handler: () => void
          ) => void;
        };
        ZoomControl: new () => unknown;
        MapTypeControl: new () => unknown;
        ControlPosition: {
          TOPRIGHT: number;
          BOTTOMRIGHT: number;
          TOPLEFT: number;
          BOTTOMLEFT: number;
        };
      };
    };
  }
}

export interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

export interface KakaoLatLngBounds {
  extend: (latlng: KakaoLatLng) => void;
}

export interface KakaoSize {
  width: number;
  height: number;
}

export interface KakaoPoint {
  x: number;
  y: number;
}

export interface KakaoMarkerImage {
  src: string;
}

export interface KakaoMarker {
  setMap: (map: KakaoMapInstance | null) => void;
  getPosition: () => KakaoLatLng;
  setPosition: (position: KakaoLatLng) => void;
}

export interface KakaoCustomOverlay {
  setMap: (map: KakaoMapInstance | null) => void;
  setPosition: (position: KakaoLatLng) => void;
  setContent: (content: HTMLElement | string) => void;
}

export interface KakaoInfoWindow {
  open: (map: KakaoMapInstance, marker?: KakaoMarker) => void;
  close: () => void;
  setContent: (content: HTMLElement | string) => void;
}

export interface KakaoMapInstance {
  setCenter: (latlng: KakaoLatLng) => void;
  panTo: (latlng: KakaoLatLng) => void;
  getCenter: () => KakaoLatLng;
  setLevel: (level: number, options?: { animate?: boolean }) => void;
  getLevel: () => number;
  setBounds: (bounds: KakaoLatLngBounds) => void;
  addControl: (control: unknown, position: number) => void;
  relayout: () => void;
}
