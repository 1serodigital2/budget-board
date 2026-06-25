const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, 'src', 'hooks');
const files = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(hooksDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/user\?\.uid/g, 'user?.id');
  content = content.replace(/user\!\.uid/g, 'user!.id');
  content = content.replace(/user\.uid/g, 'user.id');
  content = content.replace(/import \{.*\} from ["']\.\.\/services\/firebase["'];?/g, '');
  content = content.replace(/import \{ queryClient \} from ["']\.\.\/services\/firebase["'];?/g, '');
  
  if (file === 'useBudget.ts') {
    content = content.replace(/import \{ queryClient \} from "\.\.\/api\/expenses";?/g, 'import { queryClient } from "../services/supabase";');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
});
