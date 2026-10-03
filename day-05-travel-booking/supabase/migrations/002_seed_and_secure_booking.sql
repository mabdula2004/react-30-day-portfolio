insert into public.journeys (slug,city,country,eyebrow,description,price_gbp,rating,review_count,nights,vibe,image_url,featured) values
('amalfi','Amalfi Coast','Italy','Mediterranean icon','Cliffside villages, private coves and long lunches above a cobalt sea.',1840,4.96,312,5,'Coastal','https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1400&q=85',true),
('kyoto','Kyoto','Japan','Quiet ritual','Lantern-lit lanes, ryokan mornings and temples framed by changing leaves.',2260,4.98,248,6,'Culture','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=85',true),
('iceland','South Coast','Iceland','Wild north','Black-sand beaches, geothermal calm and cinematic drives beneath open skies.',2690,4.94,189,7,'Adventure','https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=1400&q=85',false),
('marrakech','Marrakech','Morocco','Desert colour','Design-led riads, Atlas foothills and spice-filled evenings in the medina.',1490,4.91,276,4,'Design','https://images.unsplash.com/photo-1597212618440-806262de4f6b5?auto=format&fit=crop&w=1400&q=85',false),
('bali','Ubud','Indonesia','Slow escape','Jungle villas, restorative rituals and chef-led dinners among the rice fields.',1320,4.95,403,6,'Wellness','https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85',false),
('swiss','Lauterbrunnen','Switzerland','Alpine hush','Mountain railways, waterfall valleys and fireside stays with front-row views.',2890,4.97,221,5,'Mountains','https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1400&q=85',false)
on conflict (slug) do update set city=excluded.city,country=excluded.country,eyebrow=excluded.eyebrow,description=excluded.description,price_gbp=excluded.price_gbp,rating=excluded.rating,review_count=excluded.review_count,nights=excluded.nights,vibe=excluded.vibe,image_url=excluded.image_url,featured=excluded.featured,active=true;

create or replace function public.create_booking(
  p_journey_id uuid,
  p_departure_date date,
  p_travellers integer,
  p_notes text default null
) returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_price integer;
  v_subtotal integer;
  v_fee integer;
  v_booking uuid;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_departure_date < current_date then raise exception 'Departure date must be in the future'; end if;
  if p_travellers < 1 or p_travellers > 12 then raise exception 'Travellers must be between 1 and 12'; end if;

  select price_gbp into v_price from public.journeys where id = p_journey_id and active = true;
  if v_price is null then raise exception 'Journey is unavailable'; end if;

  v_subtotal := v_price * p_travellers;
  v_fee := round(v_subtotal * 0.06);

  insert into public.bookings(user_id,journey_id,departure_date,travellers,subtotal_gbp,service_fee_gbp,total_gbp,notes)
  values(v_user,p_journey_id,p_departure_date,p_travellers,v_subtotal,v_fee,v_subtotal+v_fee,p_notes)
  returning id into v_booking;

  return v_booking;
end;
$$;

grant execute on function public.create_booking(uuid,date,integer,text) to authenticated;
