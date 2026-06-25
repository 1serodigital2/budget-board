const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    let fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if(fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Auth UID replacements
  content = content.replace(/user\?\.uid/g, 'user?.id');
  content = content.replace(/user\!\.uid/g, 'user!.id');
  content = content.replace(/user\.uid/g, 'user.id');
  
  // Submit event replacement
  content = content.replace(/React\.SubmitEvent/g, 'React.SyntheticEvent');
  
  // Firebase import removals
  content = content.replace(/import\s+\{.*\}\s+from\s+["']\.\.\/\.\.\/services\/firebase["'];?/g, '');
  content = content.replace(/import\s+\{.*\}\s+from\s+["']\.\.\/services\/firebase["'];?/g, '');
  content = content.replace(/import\s+\{.*\}\s+from\s+["']\.\/services\/firebase["'];?/g, '');

  if (file.includes('useBudget.ts')) {
    content = content.replace(/category: "",/g, 'category: 0,');
  }

  if (file.includes('ExpenseList.tsx')) {
    content = content.replace(/category: string;/g, 'category: number | string;');
    content = content.replace(/category: "all",/g, 'category: 0,');
    content = content.replace(/category: string \| number;/g, 'category: number | string;');
    content = content.replace(/expense\.createdAt\?\.toDate\(\)\.toLocaleDateString\(\)/g, '(expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : "No date")');
    content = content.replace(/expense\.date\?\.toDate/g, 'expense.date');
    content = content.replace(/expense\.date\.toDate\(\)\.toLocaleDateString\(\)/g, 'new Date(expense.date).toLocaleDateString()');
  }

  if (file.includes('useExpenses.ts')) {
    content = content.replace(/filter\.category === "all" \? undefined : filter\.category/g, 'filter.category === 0 ? undefined : Number(filter.category)');
  }

  if (file.includes('useBudgetVsCategory.ts')) {
    // Type casting fixes for category IDs where string was expected but number is present
    content = content.replace(/category\.id === budget\.category/g, 'category.id.toString() === budget.category.toString()');
    content = content.replace(/category\.id === expense\.category/g, 'category.id.toString() === expense.category.toString()');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
