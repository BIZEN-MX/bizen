"use client"

import React from "react"

/**
 * SmartText — Intelligent Content Renderer for BIZEN Flashcards
 *
 * Parses and renders lesson body text with:
 *  - **bold** → highlighted keyword chips with blue underline glow
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

type Segment = { type: "bold" | "money" | "quote" | "plain"; content: string }

/** Parses inline tokens: **bold**, $money/%, "quoted", plain text */
function parseInlineSegments(line: string): Segment[] {
    const segments: Segment[] = []
    // Token regex: **bold**, $number, number%, "quoted", rest
    const tokenRe = /\*\*([^*]+)\*\*|\$[\d,]+(?:\.\d+)?|\d+(?:\.\d+)?%|"([^"]+)"|([^$\d"*]+|\*(?!\*))+/g
    let m: RegExpExecArray | null
    while ((m = tokenRe.exec(line)) !== null) {
        const full = m[0]
        if (/^\*\*/.test(full)) {
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

function InlineSegments({ segments }: { segments: Segment[] }) {
    return (
        <>
            {segments.map((seg, i) => {
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
                        <div
                            key={bi}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "4px 14px",
                                background: BLUE_LIGHT,
                                border: `1.5px solid ${BLUE_BORDER}`,
                                borderRadius: 999,
                                width: "fit-content",
                                marginLeft: align === "center" ? "auto" : undefined,
                                marginRight: align === "center" ? "auto" : undefined,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: BLUE,
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                                                    }}
                            >
                                {block.text}
                            </span>
                        </div>
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
