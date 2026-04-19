"use client"

import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { haptic } from "@/utils/hapticFeedback"
import { initAudioContext, playFlipSound } from "./lessonSounds"
import { useGlossary } from "@/contexts/GlossaryContext"
import { Book, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * SmartText — Intelligent Content Renderer for BIZEN Flashcards
 *
 * Parses and renders lesson body text with:
 *  - **bold** → highlighted keyword chips with blue underline glow
 *  - [[word|definition]] → interactive glossary term with tooltip
 *  - •  bullets → styled icon-bullet list
 *  - Lines starting with # → section sub-header
 *  - Numbers like $1,000 or 8% → monospace financial highlights
 *  - Quoted "words" → italic emphasis
 *  - Normal paragraphs → clean body text
 */

const BLUE = "#0F62FE"
const BLUE_LIGHT = "#EFF6FF"
const BLUE_BORDER = "#BFDBFE"
const BLUE_DARK = "#1D4ED8"

interface SmartTextProps {
    text: string
    fontSize?: string
    align?: "left" | "center"
}

export type Segment =
  | { type: "bold" | "money" | "quote" | "plain"; content: string }
  | { type: "glossary"; word: string; definition: string }

/** Parses inline tokens: **bold**, [[word|def]], $money/%, "quoted", plain text */
export function parseInlineSegments(line: string): Segment[] {
    const segments: Segment[] = []
    // Token regex: [[word|def]], **bold**, $number, number%, "quoted", rest
    const tokenRe = /\[\[([^\]|]+)\|([^\]]+)\]\]|\*\*([^*]+)\*\*|\$[\d,]+(?:\.\d+)?|\d+(?:\.\d+)?%|"([^"]+)"|([^$\d"*\[]+|\[(?!\[)|\*(?!\*))+/g
    let m: RegExpExecArray | null
    while ((m = tokenRe.exec(line)) !== null) {
        const full = m[0]
        // [[word|definition]]
        if (full.startsWith("[[")) {
            segments.push({ type: "glossary", word: m[1], definition: m[2] })
        } else if (/^\*\*/.test(full)) {
            segments.push({ type: "bold", content: full.slice(2, -2) })
        } else if (/^(\$[\d,]+|\d+(\.\d+)?%)/.test(full)) {
            segments.push({ type: "money", content: full })
        } else if (/^"/.test(full)) {
            segments.push({ type: "quote", content: full.slice(1, -1) })
        } else {
            segments.push({ type: "plain", content: full })
        }
    }
    return segments.length ? segments : [{ type: "plain", content: line }]
}

/** Interactive glossary term — shows tooltip on hover/tap */
function GlossaryTerm({ word, definition }: { word: string; definition: string }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)
    const [coords, setCoords] = useState({ top: 0, left: 0 })

    const updateCoords = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            const triggerCenter = rect.left + rect.width / 2
            const bubbleWidth = 320 // fixed width for predictable layout
            
            let safeLeft = triggerCenter - bubbleWidth / 2
            if (safeLeft < 16) safeLeft = 16
            else if (safeLeft + bubbleWidth > window.innerWidth - 16) safeLeft = window.innerWidth - 16 - bubbleWidth
            
            setCoords({
                top: rect.top,
                left: safeLeft,
                arrowLeft: triggerCenter - safeLeft // arrow position relative to bubble
            })
        }
    }

    useEffect(() => {
        if (open) {
            updateCoords()
            window.addEventListener("scroll", updateCoords)
            window.addEventListener("resize", updateCoords)
        }
        return () => {
            window.removeEventListener("scroll", updateCoords)
            window.removeEventListener("resize", updateCoords)
        }
    }, [open])

    // Close on outside click
    useEffect(() => {
        if (!open) return
        const close = () => setOpen(false)
        document.addEventListener("click", close)
        document.addEventListener("touchstart", close)
        return () => {
            document.removeEventListener("click", close)
            document.removeEventListener("touchstart", close)
        }
    }, [open])

    return (
        <span ref={ref} style={{ position: "relative", display: "inline" }}>
            <span
                onClick={(e) => {
                    e.stopPropagation()
                    initAudioContext() 
                    playFlipSound()
                    haptic.light()
                    updateCoords()
                    setOpen(v => !v)
                }}
                className={`inline-flex items-center gap-1 font-bold text-blue-600 border-b-[2.5px] border-blue-600/20 cursor-pointer pb-0 mb-0.5 align-baseline transition-all duration-200 ${open ? 'bg-blue-50 border-blue-600/40 rounded-sm' : ''}`}
            >
                <Book size={13} strokeWidth={2.5} className="opacity-80 -mt-px" />
                {word}
            </span>

            {open && typeof document !== "undefined" && createPortal(
                <div 
                    style={{ 
                        position: "fixed", 
                        top: coords.top - 8, 
                        left: coords.left, 
                        zIndex: 100000,
                        transform: "translateY(-100%)",
                        pointerEvents: "none"
                    }}
                >
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                style={{
                                    background: "rgba(10, 20, 40, 0.96)",
                                    backdropFilter: "blur(16px)",
                                    color: "#f8fafc",
                                    borderRadius: 24,
                                    padding: "24px",
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    lineHeight: 1.6,
                                    width: 320,
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    boxShadow: "0 30px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                                    pointerEvents: "auto",
                                    position: "relative"
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-500/15 rounded-lg p-1.5 flex">
                                        <Book size={14} color="#60a5fa" />
                                    </div>
                                    <span className="text-slate-400 font-extrabold text-[11px] uppercase tracking-[0.12em]">
                                        Glosario BIZEN
                                    </span>
                                </div>
                                <X 
                                    size={18} 
                                    className="opacity-40 cursor-pointer p-1 hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setOpen(false)
                                    }} 
                                />
                            </div>

                            <div>
                                <h3 className="m-0 mb-2.5 text-[20px] font-black text-white tracking-[-0.01em] leading-[1.2]">{word}</h3>
                                <p className="m-0 text-slate-300 text-[16px] leading-[1.6] font-normal">{definition}</p>
                            </div>

                            {/* Arrow */}
                            <div style={{
                                position: "absolute",
                                bottom: -7,
                                left: coords.arrowLeft,
                                marginLeft: -8, // center the 16px wide arrow
                                width: 0, height: 0,
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderTop: "8px solid rgba(10, 20, 40, 0.96)",
                                filter: "drop-shadow(0 2px 1px rgba(255,255,255,0.1))"
                            }} />
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>,
                document.body
            )}
        </span>
    )
}

export function InlineSegments({ segments }: { segments: Segment[] }) {
    const glossaryTerms = useGlossary()

    // Second pass: find glossary terms in "plain" segments that weren't caught in first pass
    const finalSegments = React.useMemo(() => {
        if (!glossaryTerms.length) return segments;

        const results: Segment[] = [];
        segments.forEach(seg => {
            if (seg.type !== "plain" || seg.content.length < 3) {
                results.push(seg);
                return;
            }

            // Create regex for all glossary terms
            // Sort by length descending to match longest terms first
            const sortedTerms = [...glossaryTerms].sort((a, b) => b.word.length - a.word.length);
            const escapedTerms = sortedTerms.map(t => t.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            const termRe = new RegExp(`\\b(${escapedTerms})\\b`, 'gi');

            const content = seg.content;
            let lastIdx = 0;
            let match;
            
            while ((match = termRe.exec(content)) !== null) {
                // Text before match
                if (match.index > lastIdx) {
                    results.push({ type: "plain", content: content.slice(lastIdx, match.index) });
                }
                
                // The match itself
                const matchedWord = match[0];
                const termDef = glossaryTerms.find(t => t.word.toLowerCase() === matchedWord.toLowerCase())?.definition || "";
                results.push({ type: "glossary", word: matchedWord, definition: termDef });
                
                lastIdx = termRe.lastIndex;
            }

            // Text after last match
            if (lastIdx < content.length) {
                results.push({ type: "plain", content: content.slice(lastIdx) });
            }
        });
        return results;
    }, [segments, glossaryTerms]);

    return (
        <>
            {finalSegments.map((seg, i) => {
                if (seg.type === "glossary") {
                    return <GlossaryTerm key={i} word={seg.word} definition={seg.definition} />
                }
                if (seg.type === "bold") {
                    return (
                        <span
                            key={i}
                            style={{
                                fontWeight: 700,
                                color: BLUE_DARK,
                                background: BLUE_LIGHT,
                                borderRadius: "6px",
                                padding: "0 6px",
                                display: "inline",
                                borderBottom: `2.5px solid ${BLUE_BORDER}`,
                                verticalAlign: "middle"
                            }}
                        >
                            {seg.content}
                        </span>
                    )
                }
                if (seg.type === "money") {
                    return (
                        <span
                            key={i}
                            style={{
                                fontWeight: 500,
                                color: "#059669",
                                background: "#ECFDF5",
                                borderRadius: "6px",
                                padding: "1px 7px",
                                display: "inline",
                                letterSpacing: "-0.01em",
                                fontSize: "0.93em",
                            }}
                        >
                            {seg.content}
                        </span>
                    )
                }
                if (seg.type === "quote") {
                    return (
                        <em
                            key={i}
                            style={{
                                color: "inherit",
                                fontStyle: "italic",
                                fontWeight: 600,
                                opacity: 0.9
                            }}
                        >
                            "{seg.content}"
                        </em>
                    )
                }
                return <React.Fragment key={i}>{seg.content}</React.Fragment>
            })}
        </>
    )
}

/** Bullet icons mapping — cycles through a few */
const BULLET_ICONS = ["●", "◆", "▸", "→"]

export function SmartText({ text, fontSize = "clamp(16px, 2.5vw, 20px)", align = "left" }: SmartTextProps) {
    const rawLines = text.split("\n")

    type Block =
        | { kind: "paragraph"; lines: string[] }
        | { kind: "bullets"; items: string[] }
        | { kind: "subheader"; text: string }
        | { kind: "empty" }

    const blocks: Block[] = []
    let bulletBuffer: string[] = []

    const flushBullets = () => {
        if (bulletBuffer.length > 0) {
            blocks.push({ kind: "bullets", items: [...bulletBuffer] })
            bulletBuffer = []
        }
    }

    let paraBuffer: string[] = []
    const flushPara = () => {
        if (paraBuffer.length > 0) {
            blocks.push({ kind: "paragraph", lines: [...paraBuffer] })
            paraBuffer = []
        }
    }

    for (const raw of rawLines) {
        const line = raw.trimEnd()

        if (line === "") {
            flushBullets()
            flushPara()
            blocks.push({ kind: "empty" })
            continue
        }

        if (line.startsWith("# ")) {
            flushBullets()
            flushPara()
            blocks.push({ kind: "subheader", text: line.slice(2) })
            continue
        }

        if (line.startsWith("• ") || line.startsWith("- ")) {
            flushPara()
            bulletBuffer.push(line.replace(/^[•\-] /, ""))
            continue
        }

        flushBullets()
        paraBuffer.push(line)
    }
    flushBullets()
    flushPara()

    // Remove leading/trailing empties
    while (blocks.length && blocks[0].kind === "empty") blocks.shift()
    while (blocks.length && blocks[blocks.length - 1].kind === "empty") blocks.pop()

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(8px, 1.5vw, 14px)",
                width: "100%",
                textAlign: align,
            }}
        >
            {blocks.map((block, bi) => {
                if (block.kind === "empty") return <div key={bi} style={{ height: "2px" }} />

                if (block.kind === "subheader") {
                    return (
                        <h4
                            key={bi}
                            style={{
                                fontSize: "12px",
                                fontWeight: 800,
                                color: BLUE,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                margin: "4px 0 0",
                                textAlign: align,
                            }}
                        >
                            {block.text}
                        </h4>
                    )
                }

                if (block.kind === "bullets") {
                    return (
                        <ul
                            key={bi}
                            style={{
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                width: "100%",
                                textAlign: "left",
                            }}
                        >
                            {block.items.map((item, ii) => {
                                const icon = BULLET_ICONS[ii % BULLET_ICONS.length]
                                const segments = parseInlineSegments(item)
                                return (
                                    <li
                                        key={ii}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "12px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                minWidth: "26px",
                                                height: "26px",
                                                borderRadius: "8px",
                                                background: BLUE_LIGHT,
                                                border: `1.5px solid ${BLUE_BORDER}`,
                                                color: BLUE,
                                                fontSize: "11px",
                                                fontWeight: 500,
                                                flexShrink: 0,
                                                marginTop: "2px",
                                            }}
                                        >
                                            {icon}
                                        </span>
                                        <span
                                            style={{
                                                fontSize,
                                                color: "#334155",
                                                fontWeight: 500,
                                                lineHeight: 1.55,
                                            }}
                                        >
                                            <InlineSegments segments={segments} />
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    )
                }

                // paragraph
                if (block.kind === "paragraph") {
                    const fullLine = block.lines.join("\n")
                    const segments = parseInlineSegments(fullLine)
                    return (
                        <p
                            key={bi}
                            style={{
                                margin: 0,
                                fontSize,
                                color: "#334155",
                                lineHeight: 1.65,
                                fontWeight: 500,
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            <InlineSegments segments={segments} />
                        </p>
                    )
                }

                return null
            })}
        </div>
    )
}
