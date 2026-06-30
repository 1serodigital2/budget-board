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
  content = content.replace(/user\?\.uid/g, 'user?.id');
  content = content.replace(/user\.uid/g, 'user.id');
  content = content.replace(/import \{.*\} from ["']\.\.\/\.\.\/services\/firebase["'];?/g, '');
  content = content.replace(/import \{.*\} from ["']\.\.\/services\/firebase["'];?/g, '');
  content = content.replace(/import \{.*\} from ["']\.\/services\/firebase["'];?/g, '');
  content = content.replace(/import \{ queryClient \} from ["']\.\.\/\.\.\/api\/expenses["'];?/g, 'import { queryClient } from "../../services/supabase";');
  content = content.replace(/import \{ queryClient \} from ["']\.\.\/api\/expenses["'];?/g, 'import { queryClient } from "../services/supabase";');
  content = content.replace(/React\.SubmitEvent/g, 'React.SyntheticEvent');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
