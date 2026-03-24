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
            setCoords({
                top: rect.top,
                left: rect.left + rect.width / 2
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
                style={{
                    fontWeight: 700,
                    color: BLUE,
                    borderBottom: `2.5px solid ${BLUE}40`,
                    cursor: "pointer",
                    paddingBottom: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.2s ease"
                }}
            >
                <Book size={13} strokeWidth={2.5} style={{ opacity: 0.8 }} />
                {word}
            </span>

            {open && typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                            style={{
                                position: "fixed",
                                top: coords.top - 6,
                                left: coords.left,
                                transform: "translate(-50%, -100%)",
                                zIndex: 100000,
                                background: "rgba(10, 20, 40, 0.96)",
                                backdropFilter: "blur(16px)",
                                color: "#f8fafc",
                                borderRadius: 24,
                                padding: "24px",
                                fontSize: "15px",
                                fontWeight: 500,
                                lineHeight: 1.6,
                                width: "max-content",
                                minWidth: 260,
                                maxWidth: 340,
                                border: "1px solid rgba(255,255,255,0.12)",
                                boxShadow: "0 30px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                                pointerEvents: "auto",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ background: "rgba(59,130,246,0.15)", borderRadius: 8, padding: 6, display: "flex" }}>
                                        <Book size={14} color="#60a5fa" />
                                    </div>
                                    <span style={{ color: "#94a3b8", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                                        Glosario BIZEN
                                    </span>
                                </div>
                                <X 
                                    size={18} 
                                    style={{ opacity: 0.4, cursor: "pointer", padding: 4 }} 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setOpen(false)
                                    }} 
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{word}</h3>
                                <p style={{ margin: 0, color: "#cbd5e1", fontSize: 15, lineHeight: 1.55 }}>{definition}</p>
                            </div>

                            {/* Arrow */}
                            <div style={{
                                position: "absolute",
                                bottom: -6,
                                left: "50%",
                                marginLeft: -10,
                                width: 0, height: 0,
                                borderLeft: "10px solid transparent",
                                borderRight: "10px solid transparent",
                                borderTop: "10px solid rgba(10, 20, 40, 0.96)",
                            }} />
                        </motion.div>
                    )}
                </AnimatePresence>,
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
                                fontWeight: 500,
                                color: BLUE_DARK,
                                background: BLUE_LIGHT,
                                borderRadius: "6px",
                                padding: "1px 6px",
                                display: "inline",
                                borderBottom: `2.5px solid ${BLUE_BORDER}`,
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
                                color: "#7C3AED",
                                fontStyle: "italic",
                                fontWeight: 500,
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
