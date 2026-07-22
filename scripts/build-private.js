import fs from 'fs';
import path from 'path';

// Concatenate the two environment variable chunks
const part1 = process.env.CAT_PAGE_BASE64_1 || '';
const part2 = process.env.CAT_PAGE_BASE64_2 || '';
const part3 = process.env.CAT_PAGE_BASE64_3 || '';
const base64Data = part1 + part2 + part3;

if (!base64Data) {
  console.error("❌ ERROR: CAT_PAGE_BASE64 variables are missing in Netlify!");
  process.exit(1);
}

try {
  const decodedContent = Buffer.from(base64Data, 'base64').toString('utf-8');
  const targetPath = path.join(process.cwd(), 'src', 'pages', 'cat.astro');
  
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, decodedContent, 'utf-8');
  
  console.log(`✅ SUCCESS: Injected cat.astro into ${targetPath}`);
} catch (err) {
  console.error("❌ ERROR writing cat.astro:", err);
  process.exit(1);
}