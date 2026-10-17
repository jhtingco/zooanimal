"use client";

import React from "react";
import styles from "./FilterBar.module.css";
import { Region, ZooCategory } from "@/types/zoo";

interface FilterBarProps {
  selectedRegion: Region;
  onSelectRegion: (r: Region) => void;
  selectedCategory: ZooCategory;
  onSelectCategory: (c: ZooCategory) => void;
  sortBy: "rating" | "reviews" | "name";
  onSelectSortBy: (s: "rating" | "reviews" | "name") => void;
}

const REGIONS: Region[] = [
  "전체",
  "수도권",
  "강원",
  "충청",
  "전라",
  "경상",
  "제주",
];

const CATEGORIES: { key: ZooCategory; label: string }[] = [
  { key: "all", label: "전체 카테고리" },
  { key: "major", label: "대형 동물원" },
  { key: "aquarium", label: "아쿠아리움" },
  { key: "ecological", label: "생태체험/사파리" },
  { key: "ranch", label: "체험목장" },
];

export default function FilterBar({
  selectedRegion,
  onSelectRegion,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSortBy,
}: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      {/* 1단: 권역별 필터 */}
      <div className={styles.row}>
        <div className={styles.regionPills}>
          {REGIONS.map((region) => (
            <button
              key={region}
              className={`${styles.regionButton} ${
                selectedRegion === region ? styles.active : ""
              }`}
              onClick={() => onSelectRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        <div className={styles.sortGroup}>
          <label htmlFor="sort-select">정렬:</label>
          <select
            id="sort-select"
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) =>
              onSelectSortBy(e.target.value as "rating" | "reviews" | "name")
            }
          >
            <option value="rating">평점 높은 순</option>
            <option value="reviews">리뷰 많은 순</option>
            <option value="name">가나다 이름 순</option>
          </select>
        </div>
      </div>

      {/* 2단: 시설 카테고리 필터 */}
      <div className={styles.categoryGroup}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.categoryChip} ${
              selectedCategory === cat.key ? styles.active : ""
            }`}
            onClick={() => onSelectCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
