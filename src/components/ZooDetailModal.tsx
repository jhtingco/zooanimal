"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import styles from "./ZooDetailModal.module.css";
import { Zoo, AnimalClass, AnimalItem } from "@/types/zoo";
import {
  X,
  MapPin,
  Clock,
  Phone,
  Ticket,
  Sparkles,
  ExternalLink,
  Navigation,
  Check,
  Search,
  ShieldCheck,
  Building2,
  TreePine,
  Filter,
} from "lucide-react";

interface ZooDetailModalProps {
  zoo: Zoo;
  onClose: () => void;
}

export default function ZooDetailModal({ zoo, onClose }: ZooDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"animals" | "info" | "compliance">(
    "animals"
  );
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState(zoo.image);

  // 동물 도감 필터 상태
  const [animalSearch, setAnimalSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<AnimalClass | "전체">("전체");
  const [endangeredOnly, setEndangeredOnly] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(zoo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kakaoNavUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
    zoo.name
  )},${zoo.lat},${zoo.lng}`;

  const allAnimals: AnimalItem[] = zoo.allAnimals || [];

  // 동물 통계 계산
  const stats = useMemo(() => {
    const total = allAnimals.length;
    const mammals = allAnimals.filter((a) => a.className === "포유류").length;
    const birds = allAnimals.filter((a) => a.className === "조류").length;
    const reptiles = allAnimals.filter((a) => a.className === "파충류").length;
    const marine = allAnimals.filter((a) => a.className === "어류/해양").length;
    const endangered = allAnimals.filter((a) => Boolean(a.endangeredGrade)).length;
    return { total, mammals, birds, reptiles, marine, endangered };
  }, [allAnimals]);

  // 필터링된 동물 도감 목록
  const filteredAnimals = useMemo(() => {
    return allAnimals.filter((animal) => {
      // 1. 분류군 필터
      if (selectedClass !== "전체" && animal.className !== selectedClass) {
        return false;
      }

      // 2. 멸종위기종 전용 필터
      if (endangeredOnly && !animal.endangeredGrade) {
        return false;
      }

      // 3. 검색어 필터 (이름, 학명, 영문명, 서식구역)
      if (animalSearch.trim()) {
        const query = animalSearch.toLowerCase().trim();
        const matchesName = animal.name.toLowerCase().includes(query);
        const matchesSci = animal.scientificName?.toLowerCase().includes(query);
        const matchesEng = animal.englishName?.toLowerCase().includes(query);
        const matchesZone = animal.zone?.toLowerCase().includes(query);
        if (!matchesName && !matchesSci && !matchesEng && !matchesZone) {
          return false;
        }
      }

      return true;
    });
  }, [allAnimals, selectedClass, endangeredOnly, animalSearch]);

  const getEndangeredBadgeClass = (grade?: string) => {
    if (!grade) return "";
    if (grade.includes("I급")) return styles.endangeredGrade1;
    if (grade.includes("II급")) return styles.endangeredGrade2;
    if (grade.includes("천연기념물")) return styles.heritageGrade;
    return styles.citesGrade;
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-zoo-title"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="닫기"
        >
          <X size={20} />
        </button>

        {/* Header Hero Banner */}
        <div className={styles.imageBanner}>
          <Image
            src={imgSrc}
            alt={zoo.name}
            fill
            className={styles.bannerImg}
            onError={() => {
              setImgSrc(
                "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80"
              );
            }}
          />
          <div className={styles.imageGradient} />
          <div className={styles.bannerInfo}>
            <div className={styles.bannerBadges}>
              <span className={styles.tagBadge}>{zoo.region}</span>
              <span className={styles.tagBadge}>{zoo.categoryLabel}</span>
              {zoo.isPublic && <span className={styles.publicBadge}>국공립</span>}
              {zoo.isHubZoo && (
                <span className={styles.hubBadge}>🏛️ 기후부 거점동물원</span>
              )}
            </div>
            <h2 id="modal-zoo-title" className={styles.modalTitle}>
              {zoo.name}
            </h2>
            <div className={styles.modalSubtitle}>{zoo.englishName}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabItem} ${
              activeTab === "animals" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("animals")}
          >
            🐾 전체 보유 동물 도감 ({allAnimals.length}종)
          </button>
          <button
            className={`${styles.tabItem} ${
              activeTab === "info" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            ℹ️ 관람 및 이용 안내
          </button>
          <button
            className={`${styles.tabItem} ${
              activeTab === "compliance" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("compliance")}
          >
            🏛️ 기후부 관리 지표
          </button>
        </div>

        {/* Tab 1: 전체 동물 도감 (Full Animal Catalog) */}
        {activeTab === "animals" && (
          <div className={styles.scrollBody}>
            {/* 상단 통계 요약 */}
            <div className={styles.catalogStatsBar}>
              <div className={styles.statMetric}>
                <span className={styles.statNumber}>{stats.total}</span>
                <span className={styles.statLabel}>등록 동물 종수</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statMetric}>
                <span className={styles.statNumber}>{stats.mammals}</span>
                <span className={styles.statLabel}>포유류</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statMetric}>
                <span className={styles.statNumber}>{stats.birds}</span>
                <span className={styles.statLabel}>조류</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statMetric}>
                <span className={styles.statNumber}>{stats.reptiles}</span>
                <span className={styles.statLabel}>파충/양서</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statMetric}>
                <span className={styles.statNumberDanger}>{stats.endangered}</span>
                <span className={styles.statLabel}>멸종위기·천연</span>
              </div>
            </div>

            {/* 필터 및 검색창 */}
            <div className={styles.catalogFilterArea}>
              <div className={styles.animalSearchBox}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="동물명, 학명, 전시구역(예: 판다, 호랑이, 맹수사)..."
                  value={animalSearch}
                  onChange={(e) => setAnimalSearch(e.target.value)}
                  className={styles.animalSearchInput}
                />
                {animalSearch && (
                  <button
                    className={styles.clearSearchBtn}
                    onClick={() => setAnimalSearch("")}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className={styles.classChipsRow}>
                {(["전체", "포유류", "조류", "파충류", "어류/해양"] as const).map(
                  (cls) => (
                    <button
                      key={cls}
                      className={`${styles.classFilterChip} ${
                        selectedClass === cls ? styles.selectedClassChip : ""
                      }`}
                      onClick={() => setSelectedClass(cls)}
                    >
                      {cls === "포유류"
                        ? "🦁 포유류"
                        : cls === "조류"
                        ? "🦜 조류"
                        : cls === "파충류"
                        ? "🦎 파충·양서"
                        : cls === "어류/해양"
                        ? "🐬 어류·해양"
                        : "전체"}
                    </button>
                  )
                )}

                <label className={styles.endangeredToggleLabel}>
                  <input
                    type="checkbox"
                    checked={endangeredOnly}
                    onChange={(e) => setEndangeredOnly(e.target.checked)}
                  />
                  <span>⚠️ 멸종위기종만 모아보기</span>
                </label>
              </div>
            </div>

            {/* 필터링 결과 카드 리스트 */}
            <div className={styles.animalsCatalogGrid}>
              {filteredAnimals.length > 0 ? (
                filteredAnimals.map((animal) => (
                  <div key={animal.id} className={styles.animalItemCard}>
                    <div className={styles.animalCardHeader}>
                      <div className={styles.animalNames}>
                        <div className={styles.animalMainTitle}>
                          <span className={styles.animalKoreanName}>
                            {animal.name}
                          </span>
                          {animal.isKeyAnimal && (
                            <span className={styles.keyAnimalBadge}>
                              ⭐ 대표 동물
                            </span>
                          )}
                        </div>
                        {(animal.scientificName || animal.englishName) && (
                          <div className={styles.animalScientificName}>
                            {animal.scientificName}
                            {animal.scientificName && animal.englishName && " · "}
                            {animal.englishName}
                          </div>
                        )}
                      </div>
                      <span className={styles.animalClassTag}>
                        {animal.className}
                      </span>
                    </div>

                    <div className={styles.animalMetaRow}>
                      {animal.endangeredGrade && (
                        <span
                          className={`${styles.endangeredBadge} ${getEndangeredBadgeClass(
                            animal.endangeredGrade
                          )}`}
                        >
                          🛡️ {animal.endangeredGrade}
                        </span>
                      )}
                      {animal.zone && (
                        <span className={styles.zoneTag}>
                          📍 {animal.zone}
                        </span>
                      )}
                    </div>

                    {animal.highlights && (
                      <p className={styles.animalHighlights}>
                        {animal.highlights}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.noAnimalsFound}>
                  <p>일치하는 동물이 없습니다. 검색어나 분류군 필터를 조정해 보세요.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: 관람 및 이용 안내 */}
        {activeTab === "info" && (
          <div className={styles.scrollBody}>
            {/* 개요 */}
            <div className={styles.section}>
              <h3 className={styles.sectionHeading}>
                <Sparkles size={16} color="#16a34a" />
                <span>동물원 소개</span>
              </h3>
              <p className={styles.sectionText}>{zoo.description}</p>
            </div>

            {/* 입장료 안내 */}
            <div className={styles.section}>
              <h3 className={styles.sectionHeading}>
                <Ticket size={16} color="#16a34a" />
                <span>입장료 안내</span>
              </h3>
              <div className={styles.admissionGrid}>
                <div className={styles.priceCard}>
                  <div className={styles.priceLabel}>성인 (만 19세 이상)</div>
                  <div className={styles.priceValue}>{zoo.admission.adult}</div>
                </div>
                {zoo.admission.teen && (
                  <div className={styles.priceCard}>
                    <div className={styles.priceLabel}>청소년 (중/고등학생)</div>
                    <div className={styles.priceValue}>{zoo.admission.teen}</div>
                  </div>
                )}
                <div className={styles.priceCard}>
                  <div className={styles.priceLabel}>어린이 (초등학생 이하)</div>
                  <div className={styles.priceValue}>{zoo.admission.child}</div>
                </div>
              </div>
              {zoo.admission.freeCondition && (
                <div className={styles.freeCondition}>
                  ✨ <strong>무료 입장 조건:</strong> {zoo.admission.freeCondition}
                </div>
              )}
            </div>

            {/* 기본 위치 및 운영 정보 */}
            <div className={styles.section}>
              <h3 className={styles.sectionHeading}>
                <Clock size={16} color="#16a34a" />
                <span>관람 및 위치 정보</span>
              </h3>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <MapPin size={16} className={styles.infoIcon} />
                  <div>
                    <span>{zoo.address}</span>
                    <button
                      className={styles.copyAddressBtn}
                      onClick={handleCopyAddress}
                    >
                      {copied ? "복사됨!" : "주소 복사"}
                    </button>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <Clock size={16} className={styles.infoIcon} />
                  <div>
                    <div>운영 시간: {zoo.hours}</div>
                    {zoo.closedDays && (
                      <div className={styles.closedInfo}>
                        휴원일: {zoo.closedDays}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <Phone size={16} className={styles.infoIcon} />
                  <a href={`tel:${zoo.phone}`} className={styles.phoneLink}>
                    {zoo.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* 편의시설 */}
            {zoo.facilities.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionHeading}>
                  <Building2 size={16} color="#16a34a" />
                  <span>주요 편의시설</span>
                </h3>
                <div className={styles.facilitiesList}>
                  {zoo.facilities.map((facility) => (
                    <span key={facility} className={styles.facilityItem}>
                      ✓ {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 하단 링크 */}
            <div className={styles.footerActions}>
              <a
                href={kakaoNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.kakaoNavBtn}
              >
                <Navigation size={15} />
                <span>카카오맵 길찾기 바로가기</span>
                <ExternalLink size={13} />
              </a>
              {zoo.website && (
                <a
                  href={zoo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.websiteBtn}
                >
                  <ExternalLink size={15} />
                  <span>공식 홈페이지</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: 기후부 종합 관리 지표 (제2차 동물원 관리 종합계획) */}
        {activeTab === "compliance" && (
          <div className={styles.scrollBody}>
            <div className={styles.complianceAlert}>
              <ShieldCheck size={20} color="#16a34a" />
              <div>
                <strong>기후에너지환경부 《제2차 동물원 관리 종합계획》 기준 지표</strong>
                <p>
                  동물원수족관법에 따른 2028년 허가제 전면 전환 기준 및 종보전·동물복지
                  실태 평가 항목을 반영한 공식 데이터입니다.
                </p>
              </div>
            </div>

            <div className={styles.complianceGrid}>
              <div className={styles.complianceCard}>
                <div className={styles.compLabel}>인허가 현황</div>
                <div className={styles.compValue}>
                  {zoo.permitStatus || "허가제 전환 심사 진행 중"}
                </div>
                <div className={styles.compDesc}>
                  강화된 사육 면적 및 전문 수의사·사육사 인력 기준 충족 여부
                </div>
              </div>

              <div className={styles.complianceCard}>
                <div className={styles.compLabel}>거점동물원 지정</div>
                <div className={styles.compValue}>
                  {zoo.isHubZoo ? "공식 권역별 거점동물원" : "일반 동물원"}
                </div>
                <div className={styles.compDesc}>
                  권역 내 야생동물 질병 대응, 구조·치료 및 교육 지원 거점
                </div>
              </div>

              <div className={styles.complianceCard}>
                <div className={styles.compLabel}>서식지외보전기관</div>
                <div className={styles.compValue}>
                  {zoo.habitatExConservation
                    ? "환경부 지정 기관"
                    : "해당 없음"}
                </div>
                <div className={styles.compDesc}>
                  멸종위기 야생생물의 인공 증식 및 야생 복원 연구 수행
                </div>
              </div>

              <div className={styles.complianceCard}>
                <div className={styles.compLabel}>사육 생물 규모</div>
                <div className={styles.compValue}>
                  {zoo.speciesCount ? `${zoo.speciesCount}종` : "조사 중"}
                  {zoo.animalCount && ` (${zoo.animalCount.toLocaleString()}마리)`}
                </div>
                <div className={styles.compDesc}>
                  정부 실태조사 기준 보유 야생동물 전수 집계 규모
                </div>
              </div>
            </div>

            {zoo.areaM2 && (
              <div className={styles.areaInfoBox}>
                <TreePine size={16} color="#15803d" />
                <span>
                  사육 및 전시 구역 면적: <strong>{zoo.areaM2.toLocaleString()} ㎡</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
