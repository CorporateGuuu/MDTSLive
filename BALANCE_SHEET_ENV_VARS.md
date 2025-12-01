# Balance Sheet Environment Variables

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
   # Run the migration to create the balance_sheet table
   node run-balance-sheet-migration.js
   ```

4. **Access Control**
   - The page includes authentication guard
   - Users must be logged in to access balance sheet
   - Data is filtered by user_id using Row Level Security

## Features Enabled by Environment Variables

- **Database Connection**: Connects to Supabase PostgreSQL database
- **Authentication**: User session management and data filtering
- **Data Export**: CSV and PDF generation for balance sheet reports
- **Running Balance**: Automatic calculation of running balance from database

## Security Features

- **Row Level Security (RLS)**: Users can only access their own balance sheet data
- **Authentication Required**: Page redirects to login if user is not authenticated
- **Secure API Keys**: Service role key is server-side only, never exposed to client

## Development vs Production

### Development
- Uses `.env.local` for environment variables
- Connects to Supabase development database
- Includes sample transaction data for testing

### Production
- Uses production Supabase instance
- Requires proper environment variable configuration
- Database should be seeded with actual transaction data

## Troubleshooting

### Common Issues

1. **"Failed to load balance sheet data"**
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

4. **Running balance calculation issues**
   - Verify transaction data is properly ordered by date
   - Check that balance calculations are correct in database
   - Ensure no duplicate transactions exist

### Migration Issues

If the migration fails to run:
```bash
# Check migration script permissions
chmod +x run-balance-sheet-migration.js

# Verify environment variables
node -e "console.log(process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service key found' : 'Service key missing')"

# Run with verbose output
DEBUG=* node run-balance-sheet-migration.js
```

## Data Structure

The `balance_sheet` table includes:
- `user_id`: References authenticated user
- `date`: Transaction date
- `details`: Transaction description
- `debit`: Debit amount (money out)
- `credit`: Credit amount (money in)
- `balance`: Running balance after transaction
- `type`: Transaction type (Payment, Purchase, Refund, etc.)
- `reference`: Reference number or code
- `transaction_id`: Unique transaction identifier

## API Endpoints

The page uses these Supabase operations:
- `getBalanceSheetTransactions()` - Fetch user's transactions with date filters
- `exportBalanceSheetData()` - Export data for CSV/PDF generation
- Authentication checks via `supabase.auth.getSession()`

## Performance Considerations

- Database queries include proper indexing on `user_id`, `date`, and `transaction_id`
- Running balance is calculated server-side for accuracy
- Efficient data export using streaming for large datasets
- Optimized re-renders with proper state management
- Pagination reduces memory usage for large transaction lists

## Balance Calculation Logic

The running balance is calculated by:
1. Ordering transactions by date (ascending)
2. Starting with initial balance
3. For each transaction:
   - Add credit amount to balance
   - Subtract debit amount from balance
   - Store calculated balance in database

This ensures accurate running totals even with complex transaction histories.
