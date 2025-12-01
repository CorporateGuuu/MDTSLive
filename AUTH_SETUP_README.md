# Midas Technical Solutions Authentication System

## Overview
Complete user authentication system with login, registration, session management, and account dashboard.

## Features
- ✅ User registration with validation
- ✅ Secure login with password hashing
- ✅ Session-based authentication
- ✅ Account dashboard for logged-in users
- ✅ Dynamic navigation (Login/Account links)
- ✅ Logout functionality
- ✅ Form validation and error handling
- ✅ Toast notifications for user feedback

## Database Setup

### 1. Create Database
```sql
CREATE DATABASE nexustech_db;
USE nexustech_db;
```

### 2. Run Schema
Execute the SQL file: `database/users_schema.sql`

This creates:
- `users` table for user accounts
- `user_sessions` table for session management
- `password_resets` table for password recovery
- Sample admin and customer accounts

### 3. Sample Accounts
- **Admin:** admin@nexustechhub.com / admin123
- **Customer:** john.doe@example.com / customer123

## File Structure
```
├── public/
│   ├── login.php          # Backend authentication API
│   ├── auth.js            # Frontend authentication logic
│   ├── my-account.html    # Login/Register/Account page
│   └── index.html         # Updated with auth integration
├── database/
│   └── users_schema.sql   # Database schema
└── vendor/                # PHPMailer (Composer dependencies)
```

## Environment Configuration

### PHP Configuration (.env)
```env
DB_HOST=localhost
DB_NAME=nexustech_db
DB_USER=your_db_user
DB_PASS=your_db_password
```

### Database Connection
The system uses PDO for secure database connections with prepared statements.

## API Endpoints

### POST /login.php
Handles authentication actions:

#### Login
```javascript
{
  action: 'login',
  email: 'user@example.com',
  password: 'password123'
}
```

#### Register
```javascript
{
  action: 'register',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  confirm_password: 'password123',
  phone: '+1234567890',
  company: 'ABC Corp'
}
```

#### Logout
```javascript
{
  action: 'logout'
}
```

#### Check Session
```javascript
{
  action: 'check_session'
}
```

## Frontend Integration

### Include Scripts
Add to all HTML pages that need authentication:
```html
<script src="cart.js"></script>
<script src="auth.js"></script>
```

### Dynamic Navigation
The system automatically shows/hides:
- `.login-link` - Login button (when not logged in)
- `.account-link` - Account button (when logged in)
- `.logout-link` - Logout button (when logged in)

### Account Page Structure
The `my-account.html` page includes:
- Tabbed interface (Login/Register)
- Account dashboard (when logged in)
- Form validation
- Real-time feedback

## Security Features

### Password Security
- Bcrypt hashing with `password_hash()`
- Minimum 8 characters required
- Secure password verification

### Session Management
- PHP sessions with secure configuration
- Automatic session validation
- Secure logout with session destruction

### Input Validation
- Email format validation
- Required field checks
- XSS protection with proper escaping
- SQL injection prevention with prepared statements

### CSRF Protection
- Session-based request validation
- Form tokens for sensitive operations

## User Roles

### Customer (Default)
- Access to account dashboard
- Order history (future feature)
- Profile management (future feature)

### Admin
- All customer permissions
- Administrative access (future feature)
- User management (future feature)

### Staff
- Customer permissions
- Staff-specific features (future feature)

## Usage Examples

### Check Login Status
```javascript
// Check if user is logged in
if (window.authManager.isLoggedIn()) {
    const user = window.authManager.getCurrentUser();
    console.log('Logged in as:', user.name);
}
```

### Manual Login
```javascript
const formData = new FormData();
formData.append('action', 'login');
formData.append('email', 'user@example.com');
formData.append('password', 'password123');

fetch('login.php', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(result => {
    if (result.success) {
        // Login successful
        window.location.href = 'index.html';
    } else {
        // Show error
        console.error(result.message);
    }
});
```

## Error Handling

### Common Error Responses
- `Invalid email or password` - Wrong credentials
- `Email already registered` - Duplicate registration
- `Passwords do not match` - Registration validation
- `Account is deactivated` - Disabled account
- `Database connection failed` - Server error

### Frontend Error Handling
- Toast notifications for user feedback
- Form validation before submission
- Loading states during API calls
- Graceful fallbacks for network errors

## Future Enhancements

### Planned Features
- Email verification for new accounts
- Password reset functionality
- Two-factor authentication
- Social login integration
- Account profile editing
- Order history and tracking
- Admin dashboard
- User management interface

### Security Improvements
- Rate limiting for login attempts
- Account lockout after failed attempts
- Audit logging for security events
- JWT token support (optional)
- Remember me functionality

## Troubleshooting

### Common Issues

#### Database Connection Failed
- Check database credentials in environment
- Ensure MySQL server is running
- Verify database and table creation

#### Session Not Working
- Check PHP session configuration
- Ensure cookies are enabled
- Verify session save path permissions

#### AJAX Requests Failing
- Check CORS settings if using different domains
- Verify PHP error logs
- Ensure correct Content-Type headers

#### Password Hashing Issues
- Ensure PHP 5.5+ for `password_hash()`
- Check for bcrypt support
- Verify password verification logic

## Support

For technical support or questions about the authentication system:
- Email: support@nexustechhub.com
- Documentation: This README
- Code comments in PHP and JavaScript files

## License

This authentication system is part of the Midas Technical Solutions website and follows the same licensing terms.
