"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ZooCard.module.css";
import { Zoo } from "@/types/zoo";
import { Star, MapPin, Clock, Ticket, Navigation, Info } from "lucide-react";

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

  const kakaoRouteUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
    zoo.name
  )},${zoo.lat},${zoo.lng}`;

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      id={`zoo-card-${zoo.id}`}
    >
      <div className={styles.imageContainer} onClick={() => onSelect(zoo)}>
        <Image
          src={imgSrc}
          alt={zoo.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
          className={styles.image}
          onError={() => {
            // Fallback image if remote url fails
            setImgSrc(
              "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80"
            );
          }}
        />
        <div className={styles.badgeOverlay}>
          <span className={styles.regionBadge}>{zoo.region}</span>
          {zoo.isPublic && <span className={styles.publicBadge}>국공립</span>}
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
        <div className={styles.headerRow}>
          <div className={styles.titleArea}>
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

        <p className={styles.description}>{zoo.description}</p>

        <div className={styles.animalsList}>
          {zoo.keyAnimals.slice(0, 4).map((animal) => (
            <span key={animal} className={styles.animalPill}>
              🐾 {animal}
            </span>
          ))}
        </div>

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

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={() => onSelect(zoo)}
          >
            <MapPin size={14} />
            <span>지도 위치</span>
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => onOpenDetail(zoo)}
          >
            <Info size={14} />
            <span>상세정보</span>
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
