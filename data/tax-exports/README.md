# Tax Export Data - Nexus TechHub

## Overview
This directory contains Stripe Tax export files for compliance and reporting purposes.

## File Structure
- `stripe-tax-export-YYYYMMDD.csv` - Daily/periodic Stripe Tax transaction exports
- Contains detailed tax calculation data for all transactions

## Data Fields
The CSV export contains the following key fields:
- `id` - Transaction ID
- `type` - Transaction type (invoice, payment_intent, etc.)
- `currency` - Transaction currency (USD, AED, etc.)
- `transaction_date_utc` - Transaction timestamp
- `tax_code` - Product tax code (txcd_99999999 for mobile parts)
- `jurisdiction_name` - Tax jurisdiction (UAE for our transactions)
- `country_code` - Country code (AE for UAE)
- `tax_rate` - Applied tax rate (0.05 for 5% UAE VAT)
- `taxable_amount` - Amount subject to tax
- `tax_amount` - Calculated tax amount
- `total` - Total amount including tax

## UAE VAT Compliance
For Nexus TechHub UAE operations:
- Tax rate should be 0.05 (5% VAT)
- Country code should be "AE"
- Currency should be "aed"
- Tax codes: txcd_99999999 (mobile parts), txcd_20030000 (services)

## Usage
These files are used for:
1. **Tax Compliance Reporting** - Submit to UAE tax authorities
2. **Financial Reconciliation** - Match with accounting records
3. **Audit Trail** - Maintain transaction history
4. **Business Analytics** - Analyze tax collection patterns

## Processing
To process these files:
1. Import into accounting software (QuickBooks, Xero, etc.)
2. Generate tax reports for UAE FTA submissions
3. Reconcile with Stripe Dashboard data
4. Archive for compliance record-keeping

## Retention Policy
- Keep all tax export files for minimum 7 years (UAE requirement)
- Store securely with backup copies
- Regular exports recommended (monthly/quarterly)

## Contact
For questions about tax data:
- Business: Nexus TechHub
- Location: Ras Al Khaimah, UAE
- Phone: +971 58 553 1029
