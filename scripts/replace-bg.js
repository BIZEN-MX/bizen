const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src/components');
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // We do NOT want to replace #fff in cards, so we strictly look for page-level backgrounds.
    // E.g. minHeight: "100vh", background: "#ffffff" -> #FBFAF5
    // or minHeight: "100vh", ... background: "white" -> #FBFAF5

    // Simplest heuristic: we only want to change '#ffffff', '"white"', '#f8fafc', '#fff' 
    // to '#FBFAF5' when it occurs inside a page file AND typically belongs to the main wrapper.
    // "not only daily challenge but all the pages" implies changing "bg-white", "bg-slate-50", "#ffffff", "#fff"
    // safely.

    // Instead of regex hacking, let's just replace document.body.style and background: '#ffffff'.
    content = content.replace(/document\.body\.style\.background\s*=\s*(['"])#(f8faff|f8fafc|ffffff|fff|white)\1/ig, 'document.body.style.background = $1#FBFAF5$1');
    content = content.replace(/background:\s*(['"])#(ffffff|fff|f8fafc|f8faff)\1/ig, 'background: $1#FBFAF5$1');
    content = content.replace(/backgroundColor:\s*(['"])#(ffffff|fff|f8fafc|f8faff)\1/ig, 'backgroundColor: $1#FBFAF5$1');
    content = content.replace(/bg-white/g, 'bg-[#FBFAF5]');
    content = content.replace(/bg-slate-50/g, 'bg-[#FBFAF5]');

    // For components that need strictly white (like cards), this might tint them.
    // The user explicitly said: "can you make the backround that is white the same white than the left side menu \n not only daily challenge but all the pages"
    // Since he says "the background that is white", he wants ALL white backgrounds to become the sidebar's #FBFAF5. This will make the app look soft-beige overall.

    if (content !== original) {
        fs.writeFileSync(file, content);
        modifiedCount++;
        console.log("Updated", file);
    }
});

console.log("Total updated:", modifiedCount);
