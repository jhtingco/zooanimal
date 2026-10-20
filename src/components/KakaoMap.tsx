"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./KakaoMap.module.css";
import { Zoo } from "@/types/zoo";
import {
  MapPin,
  Plus,
  Minus,
  RotateCcw,
  Navigation,
  Compass,
  X,
  ExternalLink,
  Info,
} from "lucide-react";
import { KakaoMapInstance, KakaoCustomOverlay } from "@/types/kakao";

interface KakaoMapProps {
  zoos: Zoo[];
  selectedZoo: Zoo | null;
  onSelectZoo: (zoo: Zoo | null) => void;
  onOpenDetail: (zoo: Zoo) => void;
  onOpenGuideModal: () => void;
}

export default function KakaoMap({
  zoos,
  selectedZoo,
  onSelectZoo,
  onOpenDetail,
  onOpenGuideModal,
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null);
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const hasValidKey = Boolean(
    apiKey &&
      apiKey.trim().length > 10 &&
      !apiKey.includes("your_kakao")
  );

  // 1. Script Loader
  useEffect(() => {
    if (!hasValidKey) {
      return;
    }

    if (window.kakao && window.kakao.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById("kakao-map-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "kakao-map-script";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          setIsScriptLoaded(true);
        });
      };

      script.onerror = () => {
        setLoadError(
          "카카오맵 스크립트를 불러오지 못했습니다. 카카오 개발자 센터에서 'Web 사이트 도메인' 등록(localhost:3000, vercel.app)을 확인하세요."
        );
      };

      document.head.appendChild(script);
    } else {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsScriptLoaded(true);
        });
      }
    }
  }, [apiKey, hasValidKey]);

  // 2. Initialize Kakao Map
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !window.kakao?.maps) {
      return;
    }

    const defaultCenter = new window.kakao.maps.LatLng(36.2, 127.8);
    const options = {
      center: defaultCenter,
      level: 12,
    };

    const map = new window.kakao.maps.Map(containerRef.current, options);
    mapInstanceRef.current = map;

    return () => {
      mapInstanceRef.current = null;
    };
  }, [isScriptLoaded]);

  // 3. Render Custom Overlays for Zoos
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps) return;

    // Remove existing overlays
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    const map = mapInstanceRef.current;

    zoos.forEach((zoo) => {
      const position = new window.kakao.maps.LatLng(zoo.lat, zoo.lng);
      const isSelected = selectedZoo?.id === zoo.id;

      const overlayEl = document.createElement("div");
      overlayEl.className = `kakao-custom-overlay ${isSelected ? "active" : ""}`;

      // Pick an emoji matching the category
      const iconEmoji =
        zoo.category === "aquarium"
          ? "🐠"
          : zoo.category === "ranch"
          ? "🐑"
          : zoo.category === "ecological"
          ? "🌿"
          : "🦁";

      overlayEl.innerHTML = `<span>${iconEmoji}</span><span>${zoo.name}</span>`;

      overlayEl.onclick = () => {
        onSelectZoo(zoo);
      };

      const customOverlay = new window.kakao.maps.CustomOverlay({
        map: map,
        position: position,
        content: overlayEl,
        yAnchor: 1,
        zIndex: isSelected ? 30 : 10,
      });

      overlaysRef.current.push(customOverlay);
    });
  }, [zoos, selectedZoo, onSelectZoo]);

  // 4. Pan & Close-up Zoom to selected zoo
  useEffect(() => {
    if (!selectedZoo) return;

    if (mapInstanceRef.current && window.kakao?.maps) {
      const map = mapInstanceRef.current;
      const targetPos = new window.kakao.maps.LatLng(
        selectedZoo.lat,
        selectedZoo.lng
      );

      // Close-up to Level 4 (~250m scale, clear facility view) and pan smoothly
      if (map.getLevel() > 4) {
        map.setLevel(4, { animate: false });
      }
      map.panTo(targetPos);
    }
  }, [selectedZoo]);

  // Map Controls
  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setLevel(mapInstanceRef.current.getLevel() - 1);
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setLevel(mapInstanceRef.current.getLevel() + 1);
  };

  const handleResetBounds = useCallback(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps || zoos.length === 0)
      return;

    const bounds = new window.kakao.maps.LatLngBounds();
    zoos.forEach((z) => {
      bounds.extend(new window.kakao.maps.LatLng(z.lat, z.lng));
    });

    mapInstanceRef.current.setBounds(bounds);
  }, [zoos]);

  return (
    <div className={styles.mapWrapper} id="map-section-wrapper">
      {/* Real Kakao Map Canvas */}
      {hasValidKey && !loadError ? (
        <div ref={containerRef} className={styles.mapContainer} id="kakao-map" />
      ) : (
        /* Fallback Simulation Map when API Key is not yet configured or errored */
        <div className={styles.fallbackMap}>
          <div className={styles.fallbackGrid} />
          <div className={styles.fallbackContent}>
            <div className={styles.fallbackIcon}>
              <Compass size={28} />
            </div>
            <h3 className={styles.fallbackTitle}>
              {loadError
                ? "카카오맵 도메인 등록 필요"
                : "카카오맵 API 연결 대기 중"}
            </h3>
            <p className={styles.fallbackDesc}>
              {loadError ? (
                <>
                  카카오 개발자 센터에서 <strong>Web 사이트 도메인</strong>에{" "}
                  <code>https://zooanimal.vercel.app</code>을 등록해야 지도가
                  표시됩니다.
                </>
              ) : (
                <>
                  카카오 개발자 센터에서 <strong>JavaScript 키</strong>를 발급받아{" "}
                  <code>.env.local</code> 및 Vercel 환경 변수에 등록하면 실시간 지도가 활성화됩니다.
                </>
              )}
            </p>
            <button className={styles.setupGuideBtn} onClick={onOpenGuideModal}>
              <Info size={16} />
              <span>
                {loadError ? "도메인 등록 가이드 보기" : "3분 만에 카카오맵 키 등록하기"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner indicating status */}
      <div className={styles.noticeBanner} onClick={onOpenGuideModal}>
        <Compass
          size={14}
          color={loadError ? "#e11d48" : hasValidKey ? "#16a34a" : "#64748b"}
        />
        <span>
          {loadError
            ? "⚠️ 카카오맵 도메인 등록 필요 (클릭)"
            : hasValidKey
            ? "✅ 카카오맵 정상 연결됨"
            : "카카오맵 API 키 설정 가이드 보기"}
        </span>
      </div>

      {/* Map Control Buttons */}
      <div className={styles.controlsGroup}>
        <button
          className={styles.controlButton}
          onClick={handleZoomIn}
          title="확대"
          aria-label="확대"
        >
          <Plus size={18} />
        </button>
        <button
          className={styles.controlButton}
          onClick={handleZoomOut}
          title="축소"
          aria-label="축소"
        >
          <Minus size={18} />
        </button>
        <button
          className={styles.controlButton}
          onClick={handleResetBounds}
          title="전국 지도 전체보기"
          aria-label="전국 지도 전체보기"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Floating Selected Zoo Preview Card */}
      {selectedZoo && (
        <div className={styles.floatingOverlayCard}>
          <div className={styles.overlayCardHeader}>
            <div>
              <h4 className={styles.overlayTitle}>{selectedZoo.name}</h4>
              <span className={styles.overlaySubtitle}>
                {selectedZoo.region} · {selectedZoo.categoryLabel}
              </span>
            </div>
            <button
              className={styles.closeOverlayBtn}
              onClick={() => onSelectZoo(null)}
              aria-label="선택 해제"
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.overlayDetails}>
            <div>📍 {selectedZoo.address}</div>
            <div>⏰ {selectedZoo.hours}</div>
            <div>🎟️ 성인 {selectedZoo.admission.adult}</div>
          </div>

          <div className={styles.overlayActions}>
            <button
              className={styles.overlayDetailBtn}
              onClick={() => onOpenDetail(selectedZoo)}
            >
              상세보기
            </button>
            <a
              href={`https://map.kakao.com/link/to/${encodeURIComponent(
                selectedZoo.name
              )},${selectedZoo.lat},${selectedZoo.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.overlayRouteBtn}
            >
              <Navigation size={13} />
              <span>길찾기</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
