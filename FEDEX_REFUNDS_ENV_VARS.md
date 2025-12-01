# FedEx Refunds Environment Variables

This document outlines the environment variables required for the FedEx refunds functionality.

## Required Environment Variables

### Supabase Configuration
```bash
# Supabase URL (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

# Supabase Anon Key (required)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (for admin operations - optional)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Configuration
```bash
# Database URL (if using direct connection)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

## Setup Instructions

### 1. Supabase Project Setup
1. Create a new project on [Supabase](https://supabase.com)
2. Go to Settings > API
3. Copy the Project URL and anon/public key

### 2. Environment File Configuration
Create or update your `.env.local` file with the required variables:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Migration
Run the migration to create the FedEx refunds table:

```bash
# Apply the migration
node scripts/run-migrations-new.js --file migrations/012_fedex_refunds.sql

# Or use the migration runner
npm run db:migrate
```

### 4. Authentication Setup
Ensure your Supabase project has authentication enabled:
- Go to Authentication > Settings
- Configure your auth providers (Email, Google, etc.)
- Set up redirect URLs for your application

## Database Schema

The `fedex_refunds` table includes:
- `id` - UUID primary key
- `user_id` - Reference to authenticated user
- `order_number` - Order identifier
- `tracking_number` - FedEx tracking number
- `shipping_method` - Shipping service type
- `description` - User description of the issue
- `request_status` - Status of the refund request
- `shipping_charges` - Amount charged for shipping
- `claim_status` - FedEx claim status
- `refund_amount` - Amount refunded
- `claim_date` - Date claim was filed
- `ship_to` - Recipient name
- `location` - Recipient location
- Timestamps for tracking

## RLS Policies

Row Level Security is enabled with policies for:
- Users can view/insert/update their own refund requests
- Admins can view/update all refund requests

## Testing

After setup, test the functionality:
1. Navigate to `/account/fedex-refunds`
2. Submit a refund request
3. Verify data appears in the REQUEST HISTORY table
4. Check database to confirm records are saved

## Troubleshooting

### Common Issues:
1. **Authentication errors**: Verify Supabase keys and user authentication
2. **RLS policy errors**: Ensure user is authenticated and policies are correct
3. **Migration errors**: Check database permissions and connection

### Debug Commands:
```bash
# Test Supabase connection
npm run db:test

# Check migration status
node scripts/check-migrations.js
