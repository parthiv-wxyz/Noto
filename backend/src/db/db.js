import { supabase } from "../utils/supabaseClient.js";

export async function db() {
  const sql = `
    create table if not exists materials (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      subject text not null,
      course_level text check (course_level in ('Graduate', 'Post Graduate')),
      year int2 not null check (
        (course_level = 'Graduate' and year between 1 and 4) or
        (course_level = 'Post Graduate' and year between 1 and 2)
      ),
      semester int2 not null check (
        (course_level = 'Graduate' and semester between 1 and 8) or
        (course_level = 'Post Graduate' and semester between 1 and 4)
      ),
      module int2 not null check (module between 1 and 4),
      type text check (type in ('PDF', 'PPT', 'DOCX', 'ZIP', 'IMAGE')),
      uploader text,
      file_url text not null,
      uploaded_at timestamp default now()
    );

    alter table materials enable row level security;

    create policy if not exists "Allow read access for all users"
    on materials for select
    using (true);

    create policy if not exists "Allow insert for authenticated users"
    on materials for insert
    with check (auth.role() = 'authenticated');

    
    create table if not exists updates (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      description text,
      type text check (type in ('Notice','New Material','Event','System Update')),
      created_at timestamp default now()
    );

    alter table updates enable row level security;

    create policy if not exists "Allow read access to updates"
    on updates for select
    using (true);

    create policy if not exists "Allow insert to updates for authenticated users"
    on updates for insert
    with check (auth.role() = 'authenticated');


    create table if not exists question_papers (
      id uuid primary key default gen_random_uuid(),
      subject text not null,
      course_level text check (course_level in ('Graduate', 'Post Graduate')),
      year int2 not null,
      semester int2 not null check (
        (course_level = 'Graduate' and semester between 1 and 8) or
        (course_level = 'Post Graduate' and semester between 1 and 4)
      ),
      exam_type text check (exam_type in ('Regular', 'Supplementary')),
      file_url text not null,
      uploaded_at timestamp default now()
    );

    alter table question_papers enable row level security;

    create policy if not exists "Allow read access to question papers"
    on question_papers for select
    using (true);

    create policy if not exists "Allow insert to question papers for authenticated users"
    on question_papers for insert
    with check (auth.role() = 'authenticated');
  `;

  const { error } = await supabase.rpc("exec_sql", { sql });

  if (error) {
    console.error("DB initialize failed: ", error);
  } else {
    console.log("DB ready");
  }
}
