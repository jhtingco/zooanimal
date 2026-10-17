"use client";

import React, { useState } from "react";
import styles from "./ApiKeyGuideModal.module.css";
import { Key, X, Copy, Check, ExternalLink } from "lucide-react";

interface ApiKeyGuideModalProps {
  onClose: () => void;
  hasApiKey: boolean;
}

export default function ApiKeyGuideModal({
  onClose,
  hasApiKey,
}: ApiKeyGuideModalProps) {
  const [copiedLocal, setCopiedLocal] = useState(false);
  const [copiedVercel, setCopiedVercel] = useState(false);

  const localEnvSnippet = `NEXT_PUBLIC_KAKAO_MAP_KEY=여기에_발급받은_JavaScript_키_입력`;
  const vercelVarName = `NEXT_PUBLIC_KAKAO_MAP_KEY`;

  const copyText = (
    text: string,
    setCopied: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.titleIcon}>
              <Key size={18} />
            </div>
            <h3 id="guide-modal-title" className={styles.title}>
              카카오맵 API & Vercel 배포 가이드
            </h3>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {hasApiKey ? (
            <div className={styles.calloutSuccess}>
              ✅ <strong>카카오맵 API 키가 감지되었습니다!</strong> 현재 도메인이
              카카오 개발자 콘솔 Web 플랫폼에 등록되어 있다면 지도가 정상 작동합니다.
            </div>
          ) : (
            <div className={styles.calloutAlert}>
              ⚠️ <strong>아직 카카오맵 API 키가 설정되지 않았습니다.</strong> 아래
              단계에 따라 3분 만에 무료로 발급받아 등록하실 수 있습니다.
            </div>
          )}

          {/* 1단계 */}
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>1</span>
              <span>카카오 개발자 센터에서 JavaScript 키 발급</span>
            </div>
            <p className={styles.stepDesc}>
              <a
                href="https://developers.kakao.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#16a34a", textDecoration: "underline" }}
              >
                카카오 개발자 콘솔(developers.kakao.com)
              </a>
              에 로그인 후 <strong>[내 애플리케이션] &gt; [애플리케이션 추가하기]</strong>를 진행합니다.
              앱 생성 후 요약 정보 화면에서 <strong>JavaScript 키</strong>를 복사하세요.
              (※ REST API 키가 아닙니다)
            </p>
          </div>

          {/* 2단계 */}
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>2</span>
              <span>Web 플랫폼 사이트 도메인 등록 (필수!)</span>
            </div>
            <p className={styles.stepDesc}>
              [앱 설정] &gt; [플랫폼] &gt; <strong>[Web 플랫폼 등록]</strong> 메뉴에서 사용할 사이트 도메인을 등록해야 지도가 차단되지 않습니다:
            </p>
            <div className={styles.codeBox}>
              http://localhost:3000<br />
              https://&lt;내-프로젝트-이름&gt;.vercel.app
            </div>
          </div>

          {/* 3단계: 로컬 설정 */}
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>3</span>
              <span>로컬 환경 설정 (.env.local)</span>
            </div>
            <p className={styles.stepDesc}>
              프로젝트 루트의 <code>.env.local</code> 파일에 아래와 같이 붙여넣고 저장하세요.
            </p>
            <div className={styles.codeBox}>
              {localEnvSnippet}
              <button
                className={styles.copyCodeBtn}
                onClick={() => copyText(localEnvSnippet, setCopiedLocal)}
              >
                {copiedLocal ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedLocal ? "복사완료" : "복사"}</span>
              </button>
            </div>
          </div>

          {/* 4단계: Vercel 배포 설정 */}
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>4</span>
              <span>Vercel 배포 시 환경 변수 등록</span>
            </div>
            <p className={styles.stepDesc}>
              Vercel 대시보드 &gt; 프로젝트 설정 &gt; <strong>[Environment Variables]</strong>에 아래 변수를 추가한 후 Deploy(재배포)하시면 즉시 배포 환경에서도 카카오맵이 동작합니다:
            </p>
            <div className={styles.codeBox}>
              Key: {vercelVarName}<br />
              Value: 발급받은_JavaScript_키
              <button
                className={styles.copyCodeBtn}
                onClick={() => copyText(vercelVarName, setCopiedVercel)}
              >
                {copiedVercel ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedVercel ? "키이름 복사됨" : "키이름 복사"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <a
            href="https://developers.kakao.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            <span>카카오 개발자 콘솔 이동</span>
            <ExternalLink size={14} />
          </a>
          <button className={styles.confirmBtn} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
