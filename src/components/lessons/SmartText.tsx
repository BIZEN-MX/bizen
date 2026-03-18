"use client"

import React, { useState, useRef } from "react"

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

type Segment =
  | { type: "bold" | "money" | "quote" | "plain"; content: string }
  | { type: "glossary"; word: string; definition: string }

/** Parses inline tokens: **bold**, [[word|def]], $money/%, "quoted", plain text */
function parseInlineSegments(line: string): Segment[] {
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

    const toggle = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation()
        setOpen(v => !v)
    }

    // Close on outside click
    React.useEffect(() => {
        if (!open) return
        const close = () => setOpen(false)
        document.addEventListener("click", close)
        return () => document.removeEventListener("click", close)
    }, [open])

    return (
        <span ref={ref} style={{ position: "relative", display: "inline" }}>
            <span
                onClick={toggle}
                onTouchEnd={toggle}
                style={{
                    fontWeight: 700,
                    color: BLUE,
                    borderBottom: `2px dashed ${BLUE}`,
                    cursor: "pointer",
                    paddingBottom: 1,
                    display: "inline",
                }}
            >
                {word}
                <span style={{ fontSize: "0.7em", verticalAlign: "super", marginLeft: 1, opacity: 0.7 }}>?</span>
            </span>

            {open && (
                <span
                    style={{
                        position: "absolute",
                        bottom: "calc(100% + 10px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 100,
                        background: "#1e293b",
                        color: "#f8fafc",
                        borderRadius: 12,
                        padding: "10px 14px",
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: 1.5,
                        width: "max-content",
                        maxWidth: 240,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                        display: "block",
                        textAlign: "left",
                        whiteSpace: "normal",
                        pointerEvents: "none",
                    }}
                >
                    {/* Arrow */}
                    <span style={{
                        position: "absolute",
                        bottom: -6,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0, height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid #1e293b",
                    }} />
                    <span style={{ color: BLUE_BORDER, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>
                        📖 Glosario
                    </span>
                    {definition}
                </span>
            )}
        </span>
    )
}

function InlineSegments({ segments }: { segments: Segment[] }) {
    return (
        <>
            {segments.map((seg, i) => {
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
                return <React.Fragment key={i}>{(seg as any).content}</React.Fragment>
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
