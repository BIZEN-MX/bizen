import sys

with open("src/app/simulators/stocks/page.tsx", "r") as f:
    lines = f.readlines()

# The modal is from line 2610 (index 2610) to 3839 (index 3838)
# We want to extract lines 2610 to 3839 (inclusive, 1-indexed)
start_idx = 2610
end_idx = 3839

modal_lines = lines[start_idx:end_idx]

# Remove the lines from the list
del lines[start_idx:end_idx]

# Find where to insert it: right before the `</>` that closes StockSimulatorContent.
# We map backwards to find `</>`
insert_idx = -1
for i in range(len(lines)-1, -1, -1):
    if "</>" in lines[i]:
        insert_idx = i
        break

if insert_idx != -1:
    lines = lines[:insert_idx] + modal_lines + lines[insert_idx:]
    with open("src/app/simulators/stocks/page.tsx", "w") as f:
        f.writelines(lines)
    print("Successfully extracted and appended modal!")
else:
    print("Could not find insertion marker.")

