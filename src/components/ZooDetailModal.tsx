"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ZooDetailModal.module.css";
import { Zoo } from "@/types/zoo";
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
  CheckCircle2,
} from "lucide-react";

interface ZooDetailModalProps {
  zoo: Zoo;
  onClose: () => void;
}

export default function ZooDetailModal({ zoo, onClose }: ZooDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState(zoo.image);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(zoo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kakaoNavUrl = `https://map.kakao.com/link/to/${encodeURIComponent(
    zoo.name
  )},${zoo.lat},${zoo.lng}`;

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
              <span className="kakao-custom-overlay" style={{ bottom: 0, padding: "2px 8px" }}>
                {zoo.region}
              </span>
              <span className="kakao-custom-overlay" style={{ bottom: 0, padding: "2px 8px" }}>
                {zoo.categoryLabel}
              </span>
            </div>
            <h2 id="modal-zoo-title" className={styles.modalTitle}>
              {zoo.name}
            </h2>
            <div className={styles.modalSubtitle}>{zoo.englishName}</div>
          </div>
        </div>

        <div className={styles.scrollBody}>
          {/* 개요 */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>
              <Sparkles size={16} color="#16a34a" />
              <span>동물원 소개</span>
            </h3>
            <p className={styles.sectionText}>{zoo.description}</p>
          </div>

          {/* 대표 동물 */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>
              <span>주요 만날 수 있는 동물</span>
            </h3>
            <div className={styles.animalsList}>
              {zoo.keyAnimals.map((animal) => (
                <span key={animal} className={styles.animalChip}>
                  🐾 {animal}
                </span>
              ))}
            </div>
          </div>

          {/* 요금 안내 */}
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
                ✨ <strong>무료 입장:</strong> {zoo.admission.freeCondition}
              </div>
            )}
          </div>

          {/* 기본 정보 */}
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
                    <div style={{ fontSize: "12px", color: "var(--slate-500)" }}>
                      휴원일: {zoo.closedDays}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.infoRow}>
                <Phone size={16} className={styles.infoIcon} />
                <a href={`tel:${zoo.phone}`} style={{ textDecoration: "underline" }}>
                  {zoo.phone}
                </a>
              </div>
            </div>
          </div>

          {/* 편의 시설 */}
          {zoo.facilities.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionHeading}>
                <span>주요 편의시설</span>
              </h3>
              <div className={styles.facilitiesGrid}>
                {zoo.facilities.map((fac) => (
                  <span key={fac} className={styles.facilityBadge}>
                    <CheckCircle2 size={13} color="#16a34a" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footerActions}>
          {zoo.website && (
            <a
              href={zoo.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.webBtn}
            >
              <span>공식 홈페이지</span>
              <ExternalLink size={14} />
            </a>
          )}
          <a
            href={kakaoNavUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.kakaoNavBtn}
          >
            <Navigation size={15} />
            <span>카카오맵에서 길찾기</span>
          </a>
        </div>
      </div>
    </div>
  );
}
