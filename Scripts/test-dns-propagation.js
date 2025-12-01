#!/usr/bin/env node

// DNS Propagation Testing Script for SendGrid Domain Authentication
// Tests nexustechhub.ae DNS records for SendGrid configuration

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const DNS_RECORDS = [
  {
    type: 'CNAME',
    name: 'url775.nexustechhub.ae',
    expected: 'sendgrid.net',
    description: 'Link tracking subdomain'
  },
  {
    type: 'CNAME',
    name: '53169810.nexustechhub.ae',
    expected: 'sendgrid.net',
    description: 'SendGrid subdomain'
  },
  {
    type: 'CNAME',
    name: 'em7517.nexustechhub.ae',
    expected: 'u53169810.wl061.sendgrid.net',
    description: 'Email subdomain'
  },
  {
    type: 'CNAME',
    name: 's1._domainkey.nexustechhub.ae',
    expected: 's1.domainkey.u53169810.wl061.sendgrid.net',
    description: 'DKIM key 1'
  },
  {
    type: 'CNAME',
    name: 's2._domainkey.nexustechhub.ae',
    expected: 's2.domainkey.u53169810.wl061.sendgrid.net',
    description: 'DKIM key 2'
  },
  {
    type: 'TXT',
    name: '_dmarc.nexustechhub.ae',
    expected: 'v=DMARC1; p=none;',
    description: 'DMARC policy'
  }
];

async function testDNSRecord(record) {
  try {
    let command;
    if (record.type === 'CNAME') {
      command = `nslookup ${record.name}`;
    } else if (record.type === 'TXT') {
      command = `nslookup -type=TXT ${record.name}`;
    }

    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      return {
        success: false,
        error: stderr,
        record: record
      };
    }

    // Parse nslookup output
    const lines = stdout.split('\n');
    let found = false;
    let actualValue = '';

    for (const line of lines) {
      if (record.type === 'CNAME' && line.includes('canonical name')) {
        actualValue = line.split('=')[1]?.trim().replace(/\.$/, '');
        found = true;
        break;
      } else if (record.type === 'TXT' && line.includes('"')) {
        actualValue = line.match(/"([^"]*)"/)?.[1] || '';
        found = true;
        break;
      }
    }

    const matches = found && actualValue === record.expected;

    return {
      success: found,
      matches: matches,
      expected: record.expected,
      actual: actualValue,
      record: record,
      output: stdout
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      record: record
    };
  }
}

async function testAllDNSRecords() {
  console.log('🔍 Testing DNS Propagation for SendGrid Domain Authentication');
  console.log('============================================================');
  console.log(`Domain: nexustechhub.ae`);
  console.log(`Testing ${DNS_RECORDS.length} DNS records...\n`);

  const results = [];
  let passedTests = 0;

  for (const record of DNS_RECORDS) {
    console.log(`Testing: ${record.name} (${record.type})`);
    console.log(`Description: ${record.description}`);
    
    const result = await testDNSRecord(record);
    results.push(result);

    if (result.success && result.matches) {
      console.log(`✅ PASS - Record found and matches expected value`);
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Actual: ${result.actual}`);
      passedTests++;
    } else if (result.success && !result.matches) {
      console.log(`⚠️ PARTIAL - Record found but value doesn't match`);
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Actual: ${result.actual}`);
    } else {
      console.log(`❌ FAIL - Record not found or error occurred`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    
    console.log(''); // Empty line for readability
    
    // Add delay between tests to avoid overwhelming DNS servers
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('📊 DNS Propagation Test Summary');
  console.log('==============================');
  console.log(`Passed: ${passedTests}/${DNS_RECORDS.length}`);
  console.log(`Success Rate: ${((passedTests / DNS_RECORDS.length) * 100).toFixed(1)}%`);

  if (passedTests === DNS_RECORDS.length) {
    console.log('\n🎉 All DNS records are properly configured!');
    console.log('✅ SendGrid domain authentication should work');
    console.log('\n📧 You can now use these email addresses:');
    console.log('   • noreply@nexustechhub.ae');
    console.log('   • admin@nexustechhub.ae');
    console.log('   • support@nexustechhub.ae');
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Go to SendGrid Dashboard → Settings → Sender Authentication');
    console.log('2. Click "Verify" to confirm domain authentication');
    console.log('3. Update environment variables with @nexustechhub.ae emails');
    console.log('4. Test email sending functionality');
    
  } else {
    console.log('\n⚠️ Some DNS records are not properly configured');
    console.log('\n🔧 Troubleshooting Steps:');
    
    const failedRecords = results.filter(r => !r.success || !r.matches);
    failedRecords.forEach(result => {
      console.log(`\n❌ ${result.record.name}:`);
      if (!result.success) {
        console.log(`   Issue: Record not found`);
        console.log(`   Action: Add ${result.record.type} record to DNS`);
      } else if (!result.matches) {
        console.log(`   Issue: Value mismatch`);
        console.log(`   Expected: ${result.expected}`);
        console.log(`   Actual: ${result.actual}`);
        console.log(`   Action: Update record value in DNS`);
      }
    });
    
    console.log('\n💡 General Tips:');
    console.log('• DNS propagation can take 5-30 minutes');
    console.log('• Check your domain registrar\'s DNS management');
    console.log('• Ensure TTL is set to 300 or lower');
    console.log('• Contact domain registrar if issues persist');
  }

  return {
    totalTests: DNS_RECORDS.length,
    passedTests,
    successRate: (passedTests / DNS_RECORDS.length) * 100,
    allPassed: passedTests === DNS_RECORDS.length,
    results
  };
}

// Alternative DNS checking using online tools
async function checkDNSOnline() {
  console.log('\n🌐 Alternative DNS Checking Methods:');
  console.log('===================================');
  console.log('If local DNS tests fail, try these online tools:');
  console.log('');
  
  DNS_RECORDS.forEach(record => {
    const encodedName = encodeURIComponent(record.name);
    console.log(`${record.description}:`);
    console.log(`   https://dnschecker.org/#${record.type}/${encodedName}`);
  });
  
  console.log('\nThese tools check DNS from multiple global locations.');
}

// Run the tests
if (require.main === module) {
  testAllDNSRecords()
    .then(result => {
      checkDNSOnline();
      
      if (result.allPassed) {
        console.log('\n✅ DNS configuration complete! Ready for SendGrid verification.');
        process.exit(0);
      } else {
        console.log('\n⚠️ DNS configuration incomplete. Please fix the issues above.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Error testing DNS records:', error.message);
      process.exit(1);
    });
}

module.exports = { testAllDNSRecords, DNS_RECORDS };
