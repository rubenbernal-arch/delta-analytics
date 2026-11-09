-- Politicas de leads_web para usar la llave anon desde la landing.
-- Solo se permite INSERTAR. Leer, editar o borrar queda bloqueado para anon y authenticated.
revoke all on public.leads_web from anon, authenticated;
grant insert on public.leads_web to anon;

create policy leads_web_insertar_anon on public.leads_web
  for insert to anon
  with check (consentimiento is true);

-- Limites de tamano para que un insert directo no meta basura enorme
alter table public.leads_web
  add constraint leads_web_limites check (
    char_length(nombre) <= 200
    and char_length(whatsapp) <= 20
    and char_length(coalesce(correo, '')) <= 200
    and char_length(coalesce(negocio, '')) <= 200
    and octet_length(coalesce(detalle::text, '')) <= 20000
  );
