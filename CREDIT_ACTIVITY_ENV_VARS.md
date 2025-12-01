# Credit Activity Environment Variables

## Required Environment Variables

### Supabase Configuration
```bash
# Supabase URL - Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anonymous Key - Public key for client-side operations
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role Key - Required for running migrations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js papaparse jspdf react-datepicker
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env.local`
   - Add the Supabase environment variables listed above
   - Replace placeholder values with your actual Supabase project credentials

3. **Database Setup**
   ```bash
   # Run the migration to create the credit_activity table
   node run-credit-activity-migration.js
   ```

4. **Access Control**
   - The page includes authentication guard
   - Users must be logged in to access credit activity
   - Data is filtered by user_id using Row Level Security

## Features Enabled by Environment Variables

- **Database Connection**: Connects to Supabase PostgreSQL database
- **Authentication**: User session management and data filtering
- **Data Export**: CSV and PDF generation for credit activity reports
- **Real-time Updates**: Live data fetching and filtering

## Security Features

- **Row Level Security (RLS)**: Users can only access their own credit activity data
- **Authentication Required**: Page redirects to login if user is not authenticated
- **Secure API Keys**: Service role key is server-side only, never exposed to client

## Development vs Production

### Development
- Uses `.env.local` for environment variables
- Connects to Supabase development database
- Includes sample data for testing

### Production
- Uses production Supabase instance
- Requires proper environment variable configuration
- Database should be seeded with actual credit activity data

## Troubleshooting

### Common Issues

1. **"Failed to load credit activity data"**
   - Check Supabase connection and environment variables
   - Verify user authentication status
   - Check database permissions and RLS policies

2. **Export functionality not working**
   - Ensure all required packages are installed
   - Check browser console for JavaScript errors
   - Verify data export permissions

3. **Authentication redirect loop**
   - Check authentication setup in Supabase
   - Verify redirect URLs in authentication settings
   - Ensure proper session handling

### Migration Issues

If the migration fails to run:
```bash
# Check migration script permissions
chmod +x run-credit-activity-migration.js

# Verify environment variables
node -e "console.log(process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service key found' : 'Service key missing')"

# Run with verbose output
DEBUG=* node run-credit-activity-migration.js
```

## Data Structure

The `credit_activity` table includes:
- `user_id`: References authenticated user
- `date`: Transaction date
- `location`: Transaction location/business
- `reason`: Description of transaction
- `credit`: Credit amount (positive)
- `debit`: Debit amount (positive)
- `ledger`: Ledger reference code
- `transaction_id`: Unique transaction identifier

## API Endpoints

The page uses these Supabase operations:
- `getCreditActivity()` - Fetch user's credit activity with optional filters
- `exportCreditActivity()` - Export data for CSV/PDF generation
- Authentication checks via `supabase.auth.getSession()`

## Performance Considerations

- Database queries include proper indexing on `user_id`, `date`, and `transaction_id`
- Client-side filtering for credit memo option
- Efficient data export using streaming for large datasets
- Optimized re-renders with proper state management
