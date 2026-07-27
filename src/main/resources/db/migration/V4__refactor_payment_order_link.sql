-- Drop the old index; it was on a column we're about to rename, and its
-- name would be misleading afterwards.
drop index if exists idx_payments_order_id;

-- The old "order_id" column actually held Razorpay's order id string.
-- Renaming it makes the schema say what it actually is.
alter table payment rename column order_id to razorpay_order_id;
alter table payment rename column payment_id to razorpay_payment_id;

-- The real, new foreign key: a proper link from payment -> orders.id.
alter table payment add column order_id bigint;
alter table payment add constraint fk_payment_order foreign key (order_id) references orders(id);

-- Audit timestamps, used by Order.createdAt / Payment.createdAt via @PrePersist.
alter table payment add column created_at timestamp not null default now();
alter table orders add column created_at timestamp not null default now();

-- Razorpay order ids are unique per payment attempt; enforce it at the DB level too.
create unique index if not exists idx_payment_razorpay_order_id on payment (razorpay_order_id);
create index if not exists idx_payment_order_id on payment (order_id);