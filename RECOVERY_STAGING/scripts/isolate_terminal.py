import sys

with open("src/app/simulators/stocks/page.tsx", "r") as f:
    lines = f.readlines()

out_lines = []
modal_lines = []
in_modal = False
modal_depth = 0

for line in lines:
    if "{/* Quick Order Form Modal */}" in line:
        in_modal = True
        modal_lines.append(line.replace("{/* Quick Order Form Modal */}", ""))
        continue

    if in_modal:
        modal_lines.append(line)
        if "<AnimatePresence" in line:
            modal_depth += 1
        elif "</AnimatePresence>" in line:
            modal_depth -= 1
            if modal_depth == 0:
                in_modal = False
                out_lines.append("                {renderBizenTerminal()}\n")
                continue
    else:
        out_lines.append(line)

return_idx = -1
for i in range(len(out_lines)):
    if out_lines[i].startswith("  return (") and out_lines[i+1].startswith("    <>") and out_lines[i+2].startswith("      <style>"):
        return_idx = i
        break

if return_idx != -1:
    injected_func = ["  const renderBizenTerminal = () => (\n    <>\n"] + modal_lines + ["    </>\n  );\n\n"]
    
    for i in range(len(injected_func)):
        if 'backgroundColor: "rgba(11, 30, 94, 0.4)"' in injected_func[i]:
            injected_func[i] = injected_func[i].replace('backgroundColor: "rgba(11, 30, 94, 0.4)"', 'backgroundColor: tradeSymbol ? "#060d1f" : "rgba(11, 30, 94, 0.4)"')
        if 'backdropFilter: "blur(8px)"' in injected_func[i]:
            injected_func[i] = injected_func[i].replace('backdropFilter: "blur(8px)"', 'backdropFilter: tradeSymbol ? "none" : "blur(8px)"')

    # INJECT CONST DECLARATION FIRST, THEN INJECT IF STATEMENT
    out_lines = out_lines[:return_idx] + injected_func + ["  if (tradeSymbol) return renderBizenTerminal();\n\n"] + out_lines[return_idx:]

    with open("src/app/simulators/stocks/page.tsx", "w") as f:
        f.writelines(out_lines)
    print("Success")
else:
    print("Return index not found")

