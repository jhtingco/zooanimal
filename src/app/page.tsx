"use client";

import React, { useState, useMemo, useEffect } from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ZooCard from "@/components/ZooCard";
import KakaoMap from "@/components/KakaoMap";
import ZooDetailModal from "@/components/ZooDetailModal";
import ApiKeyGuideModal from "@/components/ApiKeyGuideModal";
import { ZOOS_DATA } from "@/data/zoos";
import { Zoo, Region, ZooCategory } from "@/types/zoo";
import { SearchX } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<Region>("전체");
  const [selectedCategory, setSelectedCategory] = useState<ZooCategory>("all");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "name">("rating");

  const [selectedZoo, setSelectedZoo] = useState<Zoo | null>(null);
  const [detailZoo, setDetailZoo] = useState<Zoo | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Check Kakao API key existence
  const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const hasApiKey = Boolean(
    kakaoApiKey &&
      kakaoApiKey.trim().length > 10 &&
      !kakaoApiKey.includes("your_kakao")
  );

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("zoo_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // Fallback for private mode or storage restrictions
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("zoo_favorites", JSON.stringify(next));
      } catch {
        // Ignored
      }
      return next;
    });
  };

  // Filter & Sort Logic
  const filteredZoos = useMemo(() => {
    return ZOOS_DATA.filter((zoo) => {
      // Region filter
      if (selectedRegion !== "전체" && zoo.region !== selectedRegion) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && zoo.category !== selectedCategory) {
        return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(zoo.id)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = zoo.name.toLowerCase().includes(query);
        const matchesAddress = zoo.address.toLowerCase().includes(query);
        const matchesKeyAnimals = zoo.keyAnimals.some((a) =>
          a.toLowerCase().includes(query)
        );
        const matchesAllAnimals = (zoo.allAnimals || []).some(
          (a) =>
            a.name.toLowerCase().includes(query) ||
            a.scientificName?.toLowerCase().includes(query) ||
            a.englishName?.toLowerCase().includes(query) ||
            a.zone?.toLowerCase().includes(query)
        );
        const matchesTags = zoo.tags.some((t) =>
          t.toLowerCase().includes(query)
        );
        const matchesCategory = zoo.categoryLabel.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesAddress &&
          !matchesKeyAnimals &&
          !matchesAllAnimals &&
          !matchesTags &&
          !matchesCategory
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      if (sortBy === "name") return a.name.localeCompare(b.name, "ko");
      return 0;
    });
  }, [
    selectedRegion,
    selectedCategory,
    showFavoritesOnly,
    favorites,
    searchQuery,
    sortBy,
  ]);

  // When selectedZoo changes from card or map, sync selection & view
  const handleSelectZoo = (zoo: Zoo | null) => {
    setSelectedZoo(zoo);
    if (zoo) {
      const cardEl = document.getElementById(`zoo-card-${zoo.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      // If on mobile/tablet view (< 900px), scroll map into view
      if (typeof window !== "undefined" && window.innerWidth < 900) {
        const mapEl = document.getElementById("map-section-wrapper");
        if (mapEl) {
          mapEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("전체");
    setSelectedCategory("all");
    setShowFavoritesOnly(false);
  };

  return (
    <div className={styles.container}>
      {/* Upper Navigation Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={ZOOS_DATA.length}
        filteredCount={filteredZoos.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        favoritesCount={favorites.length}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        hasApiKey={hasApiKey}
      />

      <div className={styles.mainLayout}>
        {/* Left Side: Filter Bar + Zoo Cards Scroll List */}
        <aside className={styles.sidebar}>
          <FilterBar
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSelectSortBy={setSortBy}
          />

          <div className={styles.cardsScrollArea}>
            {filteredZoos.length > 0 ? (
              filteredZoos.map((zoo) => (
                <ZooCard
                  key={zoo.id}
                  zoo={zoo}
                  isSelected={selectedZoo?.id === zoo.id}
                  isFavorite={favorites.includes(zoo.id)}
                  onSelect={handleSelectZoo}
                  onOpenDetail={setDetailZoo}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <SearchX size={28} />
                </div>
                <h4 className={styles.emptyTitle}>검색 조건과 일치하는 동물원이 없습니다</h4>
                <p className={styles.emptyDesc}>
                  선택하신 지역 또는 필터 조건을 변경하거나 검색어를 초기화해 보세요.
                </p>
                <button
                  className={styles.resetFiltersBtn}
                  onClick={handleResetFilters}
                >
                  필터 초기화
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Side: Interactive Kakao Map */}
        <section className={styles.mapSection}>
          <KakaoMap
            zoos={filteredZoos}
            selectedZoo={selectedZoo}
            onSelectZoo={handleSelectZoo}
            onOpenDetail={setDetailZoo}
            onOpenGuideModal={() => setIsGuideModalOpen(true)}
          />
        </section>
      </div>

      {/* Modal: Full Zoo Details */}
      {detailZoo && (
        <ZooDetailModal zoo={detailZoo} onClose={() => setDetailZoo(null)} />
      )}

      {/* Modal: Kakao API Key & Vercel Setup Guide */}
      {isGuideModalOpen && (
        <ApiKeyGuideModal
          hasApiKey={hasApiKey}
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}
    </div>
  );
}
