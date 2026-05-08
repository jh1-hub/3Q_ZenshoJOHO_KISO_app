import * as fs from 'fs';

let content = fs.readFileSync('src/data/practicalQuestions.ts', 'utf8');

const blocks = content.split('{\n    id: ');
for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const idMatch = block.match(/^'([^']+)'/);
    if (!idMatch) continue;
    const id = idMatch[1];
    
    if (block.includes('表計算') || block.includes('関数') || block.includes('参照方式') || block.includes('セル')) {
        if (block.includes('指数関数的')) continue;
        if (block.includes('標準的な関数')) continue;
        const descMatch = block.match(/description:\s*'([^']+)'/);
        console.log(id + ": " + (descMatch ? descMatch[1] : ''));
    }
}
