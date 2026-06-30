const fs = require('fs');

let content = fs.readFileSync('src/api/budget.ts', 'utf8');
content = content.replace(/const startMonth = range\.startMonth;\n      const endMonth = range\.endMonth;/g, 'if (!range) return query; const startMonth = range.startMonth; const endMonth = range.endMonth;');
fs.writeFileSync('src/api/budget.ts', content);

content = fs.readFileSync('src/components/category/CategoriesList.tsx', 'utf8');
content = `import { queryClient } from "../../services/supabase";\n` + content;
content = content.replace(/deleteCategory\(\{ uid: userId\!, categoryId: id \}\)/g, 'deleteCategory({ uid: userId!, categoryId: Number(id) })');
content = content.replace(/btnSlug=\{category\.id\}/g, 'btnSlug={category.id.toString()}');
content = content.replace(/btnSlug=\{.*category\.id.*edit\"\}/g, 'btnSlug={`${category.id}/edit`}');
content = content.replace(/category\.createdAt\?\.toDate\(\)\.toLocaleDateString\(\)/g, 'new Date(category.createdAt).toLocaleDateString()');
fs.writeFileSync('src/components/category/CategoriesList.tsx', content);

content = fs.readFileSync('src/hooks/useBudget.ts', 'utf8');
content = `import { queryClient } from "../services/supabase";\n` + content;
content = content.replace(/mutate\(\{ budgetDetail: inputValue, uid: user\?\.id \}\);/g, 'mutate({ budgetDetail: inputValue, uid: user?.id! });');
content = content.replace(/getBudgetExceptCurrent\(\{ uid: user\?.id, budgetId \}\)/g, 'getBudgetExceptCurrent({ uid: user?.id!, budgetId: Number(budgetId) })');
content = content.replace(/getBudgetById\(\{ uid: user\?.id, budgetId \}\)/g, 'getBudgetById({ uid: user?.id!, budgetId: Number(budgetId) })');
content = content.replace(/updateBudget\(\{ uid: user\?.id, budgetId, budgetDetail \}\)/g, 'updateBudget({ uid: user?.id!, budgetId: Number(budgetId), budgetDetail })');
fs.writeFileSync('src/hooks/useBudget.ts', content);

content = fs.readFileSync('src/components/expense/ExpenseFilter.tsx', 'utf8');
content = content.replace(/cat\.id === filter\.category/g, 'cat.id.toString() === filter.category.toString()');
fs.writeFileSync('src/components/expense/ExpenseFilter.tsx', content);

content = fs.readFileSync('src/hooks/useBudgetVsCategory.ts', 'utf8');
content = content.replace(/budget\.category/g, 'budget.category.toString()');
content = content.replace(/expense\.category/g, 'expense.category.toString()');
content = content.replace(/category\.id\.toString\(\)\.toString\(\)/g, 'category.id.toString()');
fs.writeFileSync('src/hooks/useBudgetVsCategory.ts', content);
