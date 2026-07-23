-- Optional PostgreSQL indexes. Apply through the database deployment process; Flyway is not configured.
create index if not exists idx_products_category on product (category);
create index if not exists idx_products_name_lower on product (lower(name));
create index if not exists idx_orders_username on orders (username);
create index if not exists idx_payments_order_id on payment (order_id);
