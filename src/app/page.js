"use client";

import Image from "next/image";
import { useState } from "react";

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

function Tag({ icon, label, span = 1, selected = false, onToggle }) {
  return <button className={`tag span-${span} ${selected ? "is-selected" : ""}`} type="button" onClick={() => onToggle?.({ icon, label })} aria-pressed={selected}><Icon name={icon} /><span>{label}</span></button>;
}

function InputTag({ icon, label, onRemove, disabled = false }) {
  return <button className="input-tag" type="button" onClick={onRemove} disabled={disabled} aria-label={disabled ? label : `${label}を削除`}><Icon name={icon} /><span>{label}</span></button>;
}

function DestinationCard({ image, title, detail }) {
  return <article className="destination-card"><div className="destination-image"><Image src={image} alt="" fill sizes="170px" /></div><div className="destination-copy"><strong>{title}</strong><span>{detail}</span></div><span className="drag-handle" aria-hidden="true">⋮⋮</span></article>;
}

export default function Home() {
  const [showAdvice, setShowAdvice] = useState(false);
  const [instantMode, setInstantMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [submittedTags, setSubmittedTags] = useState([]);
  const [chatMode, setChatMode] = useState(false);

  const toggleTag = (tag) => setSelectedTags((current) => current.some((item) => item.label === tag.label) ? current.filter((item) => item.label !== tag.label) : [...current, tag]);
  const isSelected = (label) => selectedTags.some((item) => item.label === label);
  const changeMode = (enabled) => { setInstantMode(enabled); setSelectedTags([]); };
  const submitRequest = () => { if (!selectedTags.length || chatMode) return; setSubmittedTags([...selectedTags]); setChatMode(true); };
  const proposalText = `${submittedTags.map((item) => item.label).join("、")}を基に旅先を提案します。`;

  return (
    <main className="page-stage">
      <section className={`app-frame ${instantMode ? "ontime" : ""}`} aria-label="Ib Navigator">
        <header className="product-header"><div className="product-brand"><strong>Ib Navigator</strong><span>AI travel assistant</span></div><button className="settings-button" type="button" aria-label="設定"><Icon name="settings" size={28} /></button></header>
        {chatMode ? <section className="conversation" aria-live="polite">
          <article className="message message-user"><strong>あなた</strong><div className="message-tags">{submittedTags.map((item) => <InputTag {...item} disabled key={item.label} />)}</div></article>
          <article className="message message-ai"><strong>IB Navigator</strong><p>もちろんです。{proposalText}</p><small>AIが提案を作成中です</small></article>
          <p className="ai-disclaimer">AIの提案には誤りが含まれる場合があります。予約前に最新情報をご確認ください。</p>
        </section> : <>
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
        </>}

        <section className="composer"><div className="drop-zone"><div className="composer-copy">{selectedTags.length ? <div className="composer-selection" aria-label="選択したタグ" tabIndex={0} onWheel={(event) => { if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) event.currentTarget.scrollLeft += event.deltaY; }}>{selectedTags.map((item) => <InputTag {...item} disabled={chatMode} onRemove={() => toggleTag(item)} key={item.label} />)}</div> : <p>タグやスポットを追加または長押で音声認識</p>}<label className="instant-mode"><input type="checkbox" checked={instantMode} disabled={chatMode} onChange={(event) => changeMode(event.target.checked)} /><span className="toggle" aria-hidden="true"><span /></span><span>即時検索モード</span></label></div><button className="send-button" type="button" disabled={!selectedTags.length || chatMode} onClick={submitRequest} aria-label="旅行条件を送信"><Icon name="arrow-right" size={16} /></button></div></section>
        <nav className="bottom-nav" aria-label="画面ナビゲーション"><a className="nav-link selected" href="#"><span className="selected-indicator" /><Icon name={instantMode ? "ontime-chat" : "chat"} size={24} /><span>チャット</span></a><a className="nav-link" href="#"><Icon name="plan" size={24} /><span>プラン</span></a></nav>
      </section>
    </main>
  );
}
