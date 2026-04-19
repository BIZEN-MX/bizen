import sys

with open("TradeTerminal.tsx", "r") as f:
    lines = f.readlines()

# The main return starts exactly at line 937 "  return (" (index 936)
# But we need to keep the style object which is inside the return until line 1178.
# Actually, the user doesn't need the dashboard styles if we are just returning the terminal.
# The terminal uses inline styles and SOME neon styles. Let's keep the <style> block just in case.
# Let's find index of "return ("
return_start_idx = -1
for i, line in enumerate(lines):
    if line.startswith("  return ("):
        return_start_idx = i
        break

# The style block ends at line 1178 roughly: "      `}</style>"
style_end_idx = -1
if return_start_idx != -1:
    for i in range(return_start_idx, len(lines)):
        if "`}</style>" in lines[i]:
            style_end_idx = i
            break

# The order-panel starts at "                      <motion.div\n" just before "className=\"order-panel\""
panel_start_idx = -1
for i in range(style_end_idx, len(lines)):
    if "className=\"order-panel\"" in lines[i]:
        panel_start_idx = i - 2 # "                      <motion.div\n" ... "                        ref={orderFormRef}\n"
        break

# The order-panel ends at the motion.div around 3836.
# It is followed by "              </motion.div>\n            )}\n          </AnimatePresence>"
panel_end_idx = -1
if panel_start_idx != -1:
    depth = 0
    for i in range(panel_start_idx, len(lines)):
        if "<motion.div" in lines[i]:
            depth += 1
        if "</motion.div>" in lines[i]:
            depth -= 1
            if depth == 0:
                panel_end_idx = i
                break

if all(v != -1 for v in [return_start_idx, style_end_idx, panel_start_idx, panel_end_idx]):
    new_lines = lines[:style_end_idx+1] # Keep everything up to </style>
    new_lines.extend(lines[panel_start_idx:panel_end_idx+1]) # Append only the order-panel div
    new_lines.append("    </>\n  );\n}\n") # Close the component fragment

    with open("TradeTerminal.tsx", "w") as f:
        f.writelines(new_lines)
    print("Successfully isolated TradeTerminal!")
else:
    print(f"Failed to find indexes: return={return_start_idx}, style={style_end_idx}, panel_start={panel_start_idx}, panel_end={panel_end_idx}")

