const fs = require('fs');
const topicIdx = 1;
const dataFilePath = `src/app/courses/tema${topicIdx}-data.ts`;
const content = fs.readFileSync(dataFilePath, 'utf-8');
const subtemasMatch = content.match(/TEMA\d+_SUBTEMAS[:\s\w\[\]]*\s*=\s*([\s\S]*?);?\n\n/);
if (subtemasMatch) {
    console.log('Match found!');
    const jsonStr = subtemasMatch[1];
    const subthemeRegex = /\{\s*title:\s*"([^"]*)",\s*lessons:\s*\[([\s\S]*?)\]\s*\}/g;
    let match;
    while ((match = subthemeRegex.exec(jsonStr)) !== null) {
        console.log('Subtheme:', match[1]);
        const lessonsStr = match[2];
        const lessonRegex = /\{\s*title:\s*"([^"]*)"[\s\S]*?slug:\s*"([^"]*)"/g;
        let lMatch;
        while ((lMatch = lessonRegex.exec(lessonsStr)) !== null) {
            console.log('  Lesson:', lMatch[1], '->', lMatch[2]);
        }
    }
} else {
    console.log('No match found');
}
