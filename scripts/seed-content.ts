import { defaultContent } from '../app/cms/content';
import fs from 'node:fs';
const json=JSON.stringify(defaultContent).replaceAll("'","''");
const sql=`insert into public.portfolio_content(id,document,revision) values ('draft','${json}'::jsonb,1),('published','${json}'::jsonb,1) on conflict(id) do nothing; select id,revision from public.portfolio_content;`;
fs.writeFileSync('supabase/002_seed.sql',sql);

