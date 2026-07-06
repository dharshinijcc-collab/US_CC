-- Add application_email column to open_positions table
alter table public.open_positions add column if not exists application_email text;

-- Update existing records to have a default application email
update public.open_positions 
set application_email = 'careers@crestcode.usa' 
where application_email is null;
