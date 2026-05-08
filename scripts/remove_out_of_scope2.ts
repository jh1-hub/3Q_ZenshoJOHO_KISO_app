import fs from 'fs';
import path from 'path';

const practicalFile = path.join(process.cwd(), 'src/data/practicalQuestions.ts');

let content = fs.readFileSync(practicalFile, 'utf8');

const idsToRemove = [
  'p-new27', 'p-new83', 'p-new85'
];

idsToRemove.forEach(id => {
  const regex = new RegExp(`\\s*\\{\\s*id:\\s*'${id}'[\\s\\S]*?\\}(,|(?=\\]))`, 'g');
  const count = (content.match(regex) || []).length;
  if(count > 0) {
    content = content.replace(regex, '');
    console.log(`Removed ${id}`);
  }
});

// Remove trailing commas if any left before closing brackets
content = content.replace(/,\\s*\\]/g, '\n]');

fs.writeFileSync(practicalFile, content, 'utf8');
console.log('Cleanup completed.');
