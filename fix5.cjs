const fs = require('fs');

let content = fs.readFileSync('src/api/budget.ts', 'utf8');
content = content.replace(/if \(\!range\) return query; const startMonth = range\.startMonth; const endMonth = range\.endMonth;\n\n      query = query\.gte\("month", startMonth\)\.lte\("month", endMonth\);/g, 'if (range) { query = query.gte("month", range.startMonth).lte("month", range.endMonth); }');
fs.writeFileSync('src/api/budget.ts', content);

content = fs.readFileSync('src/components/expense/ExpenseList.tsx', 'utf8');
content = content.replace(/const handleDelete = \(expenseId: number\) => \{/g, 'const handleDelete = (expenseId: string) => {');
content = content.replace(/mutate\(\{ uid: userId\!, id: expenseId \}\);/g, 'mutate({ uid: userId!, id: Number(expenseId) });');
content = content.replace(/btnSlug=\{expense\.id\}/g, 'btnSlug={expense.id.toString()}');
content = content.replace(/id=\{expense\.id\}/g, 'id={expense.id.toString()}');
content = content.replace(/category: appliedFilter\.category,/g, 'category: appliedFilter.category === 0 ? undefined : Number(appliedFilter.category),');
fs.writeFileSync('src/components/expense/ExpenseList.tsx', content);

content = fs.readFileSync('src/hooks/useExpenses.ts', 'utf8');
content = content.replace(/category\?: string;/g, 'category?: number;');
content = content.replace(/category: string \| undefined/g, 'category: number | undefined');
fs.writeFileSync('src/hooks/useExpenses.ts', content);

content = fs.readFileSync('src/hooks/useBudget.ts', 'utf8');
content = content.replace(/category: "",/g, 'category: 0,');
content = content.replace(/getBudgetById\(\{ uid: user\?\.id\!, budgetId \}\)/g, 'getBudgetById({ uid: user?.id!, budgetId: Number(budgetId) })');
content = content.replace(/deleteBudgetById\(\{ uid: user\?\.id\!, budgetId \}\)/g, 'deleteBudgetById({ uid: user?.id!, budgetId: Number(budgetId) })');
fs.writeFileSync('src/hooks/useBudget.ts', content);

content = fs.readFileSync('src/hooks/useBudgetVsCategory.ts', 'utf8');
content = content.replace(/budgetMap\.get\(expense\.category\.toString\(\)\)/g, 'budgetMap.get(expense.category.toString()) ?? 0');
content = content.replace(/category: categoryMap\.get\(expense\.category\.toString\(\)\)/g, 'category: categoryMap.get(Number(expense.category))');
content = content.replace(/category: categoryMap\.get\(budget\.category\.toString\(\)\)/g, 'category: categoryMap.get(Number(budget.category))');
fs.writeFileSync('src/hooks/useBudgetVsCategory.ts', content);

content = fs.readFileSync('src/pages/budgets/BudgetListingPage.tsx', 'utf8');
content = content.replace(/id=\{budget\.id\}/g, 'id={budget.id.toString()}');
content = content.replace(/btnSlug=\{budget\.id\}/g, 'btnSlug={budget.id.toString()}');
fs.writeFileSync('src/pages/budgets/BudgetListingPage.tsx', content);

console.log('Fixed');
