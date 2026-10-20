"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ZooCard.module.css";
import { Zoo } from "@/types/zoo";
import {
  Star,
  MapPin,
  Clock,
  Ticket,
  Navigation,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ZooCardProps {
  zoo: Zoo;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (zoo: Zoo) => void;
  onOpenDetail: (zoo: Zoo) => void;
  onToggleFavorite: (id: string) => void;
}

export default function ZooCard({
  zoo,
  isSelected,
  isFavorite,
  onSelect,
  onOpenDetail,
  onToggleFavorite,
}: ZooCardProps) {
  const [imgSrc, setImgSrc] = useState(zoo.image);
  const [isQuickExpanded, setIsQuickExpanded] = useState(false);

  const kakaoRouteUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
    zoo.name
  )},${zoo.lat},${zoo.lng}`;

  const allAnimalsCount = zoo.allAnimals ? zoo.allAnimals.length : zoo.keyAnimals.length;

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      id={`zoo-card-${zoo.id}`}
    >
      {/* Card Image Banner */}
      <div
        className={styles.imageContainer}
        onClick={() => onOpenDetail(zoo)}
        title="클릭하여 상세현황 및 전체 동물 도감 보기"
      >
        <Image
          src={imgSrc}
          alt={zoo.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
          className={styles.image}
          onError={() => {
            setImgSrc(
              "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80"
            );
          }}
        />
        <div className={styles.badgeOverlay}>
          <span className={styles.regionBadge}>{zoo.region}</span>
          {zoo.isPublic && <span className={styles.publicBadge}>국공립</span>}
          {zoo.isHubZoo && <span className={styles.hubBadge}>거점동물원</span>}
        </div>
        <button
          className={`${styles.favIconBtn} ${isFavorite ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(zoo.id);
          }}
          aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
          <Star
            size={16}
            fill={isFavorite ? "currentColor" : "none"}
            color={isFavorite ? "#f59e0b" : "currentColor"}
          />
        </button>
      </div>

      <div className={styles.content}>
        {/* Header Title & Rating */}
        <div className={styles.headerRow}>
          <div
            className={styles.titleArea}
            onClick={() => onOpenDetail(zoo)}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.categoryTag}>{zoo.categoryLabel}</span>
            <h3 className={styles.name}>{zoo.name}</h3>
            <span className={styles.englishName}>{zoo.englishName}</span>
          </div>
          <div className={styles.ratingArea}>
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span>{zoo.rating.toFixed(1)}</span>
            <span className={styles.reviewCount}>({zoo.reviewCount})</span>
          </div>
        </div>

        {/* 기후부 인허가 & 보유규모 배지 */}
        <div className={styles.masterPlanPillRow}>
          {zoo.speciesCount && (
            <span className={styles.statsPill}>
              🐾 보유 {zoo.speciesCount}종 ({zoo.animalCount?.toLocaleString()}수)
            </span>
          )}
          {zoo.permitStatus && (
            <span className={styles.permitPill}>
              <ShieldCheck size={11} />
              <span>{zoo.permitStatus.split(" ")[0]}</span>
            </span>
          )}
        </div>

        <p className={styles.description}>{zoo.description}</p>

        {/* 대표 동물 태그 */}
        <div className={styles.animalsList}>
          {zoo.keyAnimals.slice(0, 4).map((animal) => (
            <span key={animal} className={styles.animalPill}>
              🐾 {animal}
            </span>
          ))}
          {allAnimalsCount > 4 && (
            <span
              className={styles.moreAnimalsPill}
              onClick={() => onOpenDetail(zoo)}
            >
              +{allAnimalsCount - 4}종 더보기
            </span>
          )}
        </div>

        {/* 메타 정보 (주소, 시간, 요금) */}
        <div className={styles.metaList}>
          <div className={styles.metaItem}>
            <MapPin size={13} className={styles.metaIcon} />
            <span>{zoo.address}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={13} className={styles.metaIcon} />
            <span>{zoo.hours}</span>
          </div>
          <div className={styles.metaItem}>
            <Ticket size={13} className={styles.metaIcon} />
            <span>성인 {zoo.admission.adult}</span>
          </div>
        </div>

        {/* 인라인 빠른 상세현황 아코디언 토글 */}
        <button
          className={styles.quickExpandToggle}
          onClick={() => setIsQuickExpanded(!isQuickExpanded)}
          aria-expanded={isQuickExpanded}
        >
          <span>{isQuickExpanded ? "간략히 보기" : "좌측에서 빠른 상세현황 펼치기"}</span>
          {isQuickExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isQuickExpanded && (
          <div className={styles.quickExpandedPanel}>
            <div className={styles.quickInfoBox}>
              <div className={styles.quickInfoHeader}>
                <Sparkles size={13} color="#16a34a" />
                <strong>기후부 동물원 종합 관리 지표</strong>
              </div>
              <ul className={styles.quickMetricsList}>
                <li>
                  <span>인허가 상태:</span> <strong>{zoo.permitStatus || "등록 유예 중"}</strong>
                </li>
                <li>
                  <span>서식지외보전기관:</span>{" "}
                  <strong>{zoo.habitatExConservation ? "지정 완료 (우수 생태연구)" : "해당 없음"}</strong>
                </li>
                {zoo.areaM2 && (
                  <li>
                    <span>시설 부지 면적:</span>{" "}
                    <strong>{zoo.areaM2.toLocaleString()} ㎡</strong>
                  </li>
                )}
              </ul>
            </div>

            <div className={styles.quickAnimalsHeader}>
              <span>전체 보유 동물 ({allAnimalsCount}종 등록)</span>
              <button
                className={styles.viewFullCatalogLink}
                onClick={() => onOpenDetail(zoo)}
              >
                도감 팝업으로 전체보기 &rarr;
              </button>
            </div>
            <div className={styles.quickAnimalsChips}>
              {(zoo.allAnimals || []).slice(0, 8).map((animal) => (
                <span
                  key={animal.id}
                  className={`${styles.catalogChip} ${
                    animal.endangeredGrade ? styles.endangered : ""
                  }`}
                  title={animal.highlights || animal.name}
                  onClick={() => onOpenDetail(zoo)}
                >
                  {animal.className === "포유류"
                    ? "🦁"
                    : animal.className === "조류"
                    ? "🦜"
                    : animal.className === "파충류"
                    ? "🦎"
                    : "🐠"}{" "}
                  {animal.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            className={styles.focusMapButton}
            onClick={() => onSelect(zoo)}
            title="우측 지도에서 이 위치로 이동하고 확대합니다"
          >
            <MapPin size={14} />
            <span>지도 포커스</span>
          </button>
          <button
            className={styles.detailButton}
            onClick={() => onOpenDetail(zoo)}
            title="전체 동물 도감 및 상세현황 모달을 엽니다"
          >
            <Info size={14} />
            <span>상세현황 보기</span>
          </button>
          <a
            href={kakaoRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.routeButton}
          >
            <Navigation size={13} />
            <span>카카오맵 길찾기 바로가기</span>
          </a>
        </div>
      </div>
    </article>
  );
}
