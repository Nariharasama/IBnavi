"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const Icon = ({ name, size = 16, alt = "" }) => <Image className="icon" src={`/figma-assets/${name}.svg`} width={size} height={size} alt={alt} />;

const discoveryItems = [
  { icon:"restaurant", label:"美味しい農家料理を食べたい", span:3 }, { icon:"tree", label:"公園", span:1 },
  { icon:"palm-tree", label:"海の日", span:1 }, { icon:"building", label:"博物館", span:1 }, { icon:"explore", label:"中央本線沿線探検", span:2 },
];
const lowerItems = [
  { icon:"pedestrian", label:"親子向け施設完備", span:2 }, { icon:"face-cool", label:"避暑地", span:1 }, { icon:"theater", label:"文化旅", span:1 },
  { icon:"cabin", label:"指定席", span:1 }, { icon:"explore", label:"IBポイント貯める・使える", span:3 },
];
const pinnedItems = [
  { icon:"pedestrian", label:"駅バス停徒歩15分以内", span:2 }, { icon:"rain", label:"雨の日でも楽しめる", span:2 },
  { icon:"purchase", label:"キャッシュレス決済可能", span:2 }, { icon:"add", label:"追加", span:1 },
];
const instantItems = [
  { icon:"direction", label:"渋滞回避の移動ルーティング", span:3 }, { icon:"cabin", label:"残席", span:1 },
  { icon:"building", label:"博物館", span:1 }, { icon:"palm-tree", label:"海の日", span:1 }, { icon:"pedestrian-child", label:"トイレ個室空き", span:2 },
  { icon:"hotel", label:"宿泊", span:1 }, { icon:"pedestrian-family", label:"日帰り貸切温泉風呂", span:2 }, { icon:"home", label:"帰宅", span:1 },
];
const savedPlans = [
  { month:"8月", day:"24", state:"近日のプラン", title:"高原の湖と森林散歩", location:"山梨県・日帰り", description:"木陰の散歩道と湖畔ランチ", tags:["ベビーカーOK","避暑地"], upcoming:true },
  { month:"9月", day:"07", state:"計画中", title:"名古屋 親子ミュージアム", location:"愛知県・1泊2日", description:"科学館を中心にした雨の日プラン", tags:["屋内","授乳室"] },
  { month:"7月", day:"13", state:"完了", title:"横浜みなとみらい散歩", location:"神奈川県・日帰り", description:"水族館と海辺の短距離コース", tags:["電車移動","家族向け"] },
];

function Tag({ icon, label, span = 1, selected = false, onToggle }) {
  return <button className={`tag span-${span} ${selected ? "is-selected" : ""}`} type="button" onClick={() => onToggle?.({ icon, label })} aria-pressed={selected}><Icon name={icon} /><span>{label}</span></button>;
}

function InputTag({ icon, label, onRemove, disabled = false }) {
  return <button className="input-tag" type="button" onClick={onRemove} disabled={disabled} aria-label={disabled ? label : `${label}を削除`}><Icon name={icon} /><span>{label}</span></button>;
}

function DestinationCard({ image, title, detail }) {
  return <article className="destination-card"><div className="destination-image"><Image src={image} alt="" fill sizes="170px" /></div><div className="destination-copy"><strong>{title}</strong><span>{detail}</span></div><span className="drag-handle" aria-hidden="true">⋮⋮</span></article>;
}

function SavedPlanCard({ plan }) {
  return <article className={`saved-plan-card ${plan.upcoming ? "upcoming" : ""}`}>
    <div className="plan-date"><span>{plan.month}</span><strong>{plan.day}</strong><span>日</span></div>
    <div className="saved-plan-copy"><div className="plan-status-row"><span className="plan-status">{plan.state}</span><button type="button" aria-label={`${plan.title}のメニュー`}><Icon name="more" /></button></div><h2>{plan.title}</h2><p className="plan-location"><Icon name="location" />{plan.location}</p><p className="plan-description">{plan.description}</p><div className="plan-tags">{plan.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
  </article>;
}

function PlansView() {
  return <section className="plans-view" aria-label="保存したプラン">
    <div className="plans-controls"><div className="plans-title-row"><h1>保存したプラン</h1><span>3件</span></div><label className="plans-search"><Icon name="plans-search" /><input type="search" placeholder="プラン名・行き先で検索" aria-label="プラン名・行き先で検索" /></label><div className="plans-filters"><button className="active" type="button">すべて</button><button type="button">近日</button><button type="button">過去</button><button className="sort" type="button">更新順<Icon name="chevron-down" /></button></div></div>
    <div className="plans-list">{savedPlans.map((plan) => <SavedPlanCard plan={plan} key={plan.title} />)}</div>
  </section>;
}

export default function Home() {
  const [activeView, setActiveView] = useState("chat");
  const [showAdvice, setShowAdvice] = useState(false);
  const [instantMode, setInstantMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [submittedTags, setSubmittedTags] = useState([]);
  const [chatMode, setChatMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeStart = useRef(null);

  const toggleTag = (tag) => setSelectedTags((current) => current.some((item) => item.label === tag.label) ? current.filter((item) => item.label !== tag.label) : [...current, tag]);
  const isSelected = (label) => selectedTags.some((item) => item.label === label);
  const changeMode = (enabled) => { setInstantMode(enabled); setSelectedTags([]); };
  const submitRequest = () => {
    if (!selectedTags.length || chatMode || isSubmitting) return;
    setSubmittedTags([...selectedTags]);
    setIsSubmitting(true);
    window.setTimeout(() => { setChatMode(true); setIsSubmitting(false); }, 320);
  };
  const proposalText = `${submittedTags.map((item) => item.label).join("、")}を基に旅先を提案します。`;
  const startSwipe = (event) => {
    if (event.target.closest("[data-no-page-swipe]")) return;
    const touch = event.touches[0];
    swipeStart.current = { x:touch.clientX, y:touch.clientY, axis:null };
  };
  const moveSwipe = (event) => {
    if (!swipeStart.current) return;
    const touch = event.touches[0];
    const dx = touch.clientX - swipeStart.current.x;
    const dy = touch.clientY - swipeStart.current.y;
    if (!swipeStart.current.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) swipeStart.current.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (swipeStart.current.axis !== "x") return;
    const atEdge = (activeView === "chat" && dx > 0) || (activeView === "plans" && dx < 0);
    setIsSwiping(true);
    setDragX(atEdge ? dx * .2 : dx);
  };
  const endSwipe = () => {
    if (swipeStart.current?.axis === "x") {
      if (dragX < -55 && activeView === "chat") setActiveView("plans");
      if (dragX > 55 && activeView === "plans") setActiveView("chat");
    }
    swipeStart.current = null;
    setIsSwiping(false);
    setDragX(0);
  };

  return (
    <main className="page-stage">
      <section className={`app-frame ${activeView === "chat" && instantMode ? "ontime" : ""}`} aria-label="Ib Navigator">
        <header className="product-header"><div className="product-brand"><strong>Ib Navigator</strong><span>AI travel assistant</span></div><button className="settings-button" type="button" aria-label="設定"><Icon name="settings" size={28} /></button></header>
        <div className="page-swipe-viewport" onTouchStart={startSwipe} onTouchMove={moveSwipe} onTouchEnd={endSwipe} onTouchCancel={endSwipe}>
        <div className={`page-swipe-track ${isSwiping ? "is-swiping" : ""}`} style={{ transform:`translateX(calc(${activeView === "plans" ? -50 : 0}% + ${dragX}px))` }}>
        <div className="page-panel chat-panel" aria-hidden={activeView !== "chat"}>
        {chatMode ? <section className="conversation conversation-enter" aria-live="polite">
          <article className="message message-user"><strong>あなた</strong><div className="message-tags">{submittedTags.map((item) => <InputTag {...item} disabled key={item.label} />)}</div></article>
          <article className="message message-ai"><strong>IB Navigator</strong><p>もちろんです。{proposalText}</p><small>AIが提案を作成中です</small></article>
          <p className="ai-disclaimer">AIの提案には誤りが含まれる場合があります。予約前に最新情報をご確認ください。</p>
        </section> : <div className={`planning-content ${isSubmitting ? "is-leaving" : ""}`}>
        <section className="greeting"><h1>こんばんは、佐藤さん</h1>{instantMode ? <p>直ぐにアドレスを提案できます</p> : <p>どんなお出かけを一緒に計画しましょうか？<br />希望を伝えるだけで候補を整理します。</p>}</section>
        <div className="top-gap" />
        <button className={`advice-card ${showAdvice ? "is-open" : ""}`} type="button" onClick={() => setShowAdvice((open) => !open)} aria-expanded={showAdvice} aria-controls="discover-content">
          <span><strong>{showAdvice ? "天気情報、混雑状況による提案を隠す" : "天気情報、混雑状況による提案を表示"}</strong><small>{showAdvice ? "入力または音声" : "AIが提案する旅アドバイス"}</small></span>
          <Icon name={showAdvice ? "close" : instantMode ? "ontime-advice" : "advice"} size={16} />
        </button>

        <div className={`discover-scroll ${showAdvice ? "is-visible" : ""}`} id="discover-content" aria-hidden={!showAdvice}>
          <div className="discover-grid">
            {instantMode ? instantItems.map((item) => <Tag {...item} selected={isSelected(item.label)} onToggle={toggleTag} key={item.label} />) : <>
              {discoveryItems.map((item) => <Tag {...item} selected={isSelected(item.label)} onToggle={toggleTag} key={item.label} />)}
              <DestinationCard image="/travel-cards/forest-lake.png" title="高原の湖と森林散歩" detail="木陰が多く、夏でも涼しい自然スポット" />
              <DestinationCard image="/travel-cards/science-museum.png" title="名古屋市科学館" detail="屋内で親子が楽しめる体験型ミュージアム" />
              {lowerItems.map((item) => <Tag {...item} selected={isSelected(item.label)} onToggle={toggleTag} key={item.label} />)}
            </>}
          </div>
          <div className="pinned-heading"><Icon name="pin" /><span>クリップしたタッグ</span></div>
          <div className="pinned-grid">{pinnedItems.map((item) => <Tag {...item} selected={isSelected(item.label)} onToggle={item.label === "追加" ? undefined : toggleTag} key={item.label} />)}</div>
        </div>
        </div>}

        <section className="composer"><div className="drop-zone"><div className="composer-copy">{selectedTags.length ? <div className="composer-selection" data-no-page-swipe aria-label="選択したタグ" tabIndex={0} onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) event.currentTarget.scrollLeft += event.deltaY; }}>{selectedTags.map((item) => <InputTag {...item} disabled={chatMode || isSubmitting} onRemove={() => toggleTag(item)} key={item.label} />)}</div> : <p>タグやスポットを追加または長押で音声認識</p>}<label className="instant-mode"><input type="checkbox" checked={instantMode} disabled={chatMode || isSubmitting} onChange={(event) => changeMode(event.target.checked)} /><span className="toggle" aria-hidden="true"><span /></span><span>即時検索モード</span></label></div><button className="send-button" type="button" disabled={!selectedTags.length || chatMode || isSubmitting} onClick={submitRequest} aria-label="旅行条件を送信"><Icon name="arrow-right" size={16} /></button></div></section>
        </div>
        <div className="page-panel plans-panel" aria-hidden={activeView !== "plans"}><PlansView /></div>
        </div></div>
        <nav className="bottom-nav" aria-label="画面ナビゲーション"><button className={`nav-link ${activeView === "chat" ? "selected" : ""}`} type="button" onClick={() => setActiveView("chat")}>{activeView === "chat" && <span className="selected-indicator" />}<Icon name={activeView === "chat" ? instantMode ? "ontime-chat" : "chat" : "chat-black"} size={24} /><span>チャット</span></button><button className={`nav-link ${activeView === "plans" ? "selected" : ""}`} type="button" onClick={() => setActiveView("plans")}>{activeView === "plans" && <span className="selected-indicator" />}<Icon name={activeView === "plans" ? "plan-blue" : "plan"} size={24} /><span>プラン</span></button></nav>
      </section>
    </main>
  );
}
