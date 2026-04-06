-- Products
create table products (
  id serial primary key,
  name text not null,
  description text,
  price_cents integer not null default 0,
  badge text,
  images text[] default '{}',
  max_custom_chars integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_products_active on products (is_active);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  customer_email text,
  total_cents integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index idx_orders_status on orders (status);
create index idx_orders_stripe on orders (stripe_session_id);

-- Order items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id integer not null references products(id),
  quantity integer not null default 1,
  price_cents integer not null default 0,
  customization_text text,
  variant_id integer references product_variants(id),
  variant_name text,
  selected_character text
);

create index idx_order_items_order on order_items (order_id);

-- Product variants (color schemes for customizable products)
create table product_variants (
  id serial primary key,
  product_id integer not null references products(id) on delete cascade,
  name text not null,
  photo text,
  character_font text not null default 'Lilita One',
  character_color text not null default '#FFFFFF',
  character_stroke_color text,
  character_stroke_width numeric(4,1) default 0,
  character_position_x numeric(5,2) not null default 50,
  character_position_y numeric(5,2) not null default 50,
  character_size numeric(5,2) not null default 20,
  stripe_color_1 text not null default '#04324b',
  stripe_color_2 text not null default '#a4cea6',
  stripe_color_3 text not null default '#c97a4a',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_variants_product on product_variants (product_id);
create index idx_variants_active on product_variants (product_id, is_active);

-- Contact submissions
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
