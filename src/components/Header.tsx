"use client";

import React from "react";
import styles from "./Header.module.css";
import { Compass, Search, X, Star, HelpCircle } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount: number;
  filteredCount: number;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  onOpenGuideModal: () => void;
  hasApiKey: boolean;
}

export default function Header({
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
  onOpenGuideModal,
  hasApiKey,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.brand} onClick={() => onSearchChange("")}>
          <div className={styles.logoIcon}>
            <Compass size={22} />
          </div>
          <div className={styles.brandTitles}>
            <span className={styles.brandTitle}>전국 동물원 지도</span>
            <span className={styles.brandSubtitle}>ZooSafari Korea</span>
          </div>
        </div>

        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="동물원 이름, 지역, 동물(판다, 호랑이)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={() => onSearchChange("")}
              aria-label="검색어 지우기"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.badge}>
          <span>
            {filteredCount === totalCount
              ? `전국 ${totalCount}개소`
              : `${filteredCount} / ${totalCount}개소`}
          </span>
        </div>

        <button
          className={`${styles.favButton} ${showFavoritesOnly ? styles.active : ""}`}
          onClick={onToggleFavorites}
          title="즐겨찾는 동물원만 모아보기"
        >
          <Star
            size={16}
            fill={showFavoritesOnly ? "currentColor" : "none"}
            color={showFavoritesOnly ? "var(--accent-600)" : "currentColor"}
          />
          <span>즐겨찾기</span>
          {favoritesCount > 0 && <span>({favoritesCount})</span>}
        </button>

        <button
          className={styles.guideButton}
          onClick={onOpenGuideModal}
          title="카카오맵 API 키 및 Vercel 배포 가이드"
        >
          <span
            className={`${styles.keyStatusTag} ${
              hasApiKey ? styles.keyStatusConnected : styles.keyStatusMissing
            }`}
          />
          <HelpCircle size={15} />
          <span>{hasApiKey ? "API 키 연결됨" : "API 키 설정"}</span>
        </button>
      </div>
    </header>
  );
}
