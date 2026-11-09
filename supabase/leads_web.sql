-- Leads de la landing /paginas-web. Ejecutar en el SQL Editor de Supabase.
create table if not exists public.leads_web (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  estado text not null default 'nuevo',
  prioridad text not null default 'media' check (prioridad in ('alta', 'media', 'baja')),
  nombre text not null,
  whatsapp text not null,
  correo text,
  negocio text,
  giro text,
  situacion text,
  objetivo text,
  inicio text,
  inversion text,
  detalle jsonb not null default '{}'::jsonb,
  consentimiento boolean not null default false,
  pagina text,
  gclid text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text
);

-- Sin politicas: solo la llave de servicio (el servidor) puede leer y escribir.
alter table public.leads_web enable row level security;

create index if not exists leads_web_created_idx on public.leads_web (created_at desc);
create index if not exists leads_web_prioridad_idx on public.leads_web (prioridad, created_at desc);
