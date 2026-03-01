-- Products
create table products (
  id serial primary key,
  name text not null,
  description text,
  emoji text,
  price_cents integer not null default 0,
  price text not null default '$0',
  badge text,
  images text[] default '{}',
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_products_active on products (is_active);
create index idx_products_category on products (category);

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
  price_cents integer not null default 0
);

create index idx_order_items_order on order_items (order_id);

-- Contact submissions
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
