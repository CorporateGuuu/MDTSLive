import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register Roboto font (optional - falls back to default if fonts not available)
try {
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: '/fonts/Roboto-Regular.ttf' },
      { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
      { src: '/fonts/Roboto-Italic.ttf', fontStyle: 'italic' },
    ]
  });
} catch (error) {
  // Font registration failed, will use default fonts
  console.warn('Roboto font not available, using default fonts');
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066cc',
    textAlign: 'center',
    marginBottom: 20,
  },
  certificateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 1.6,
  },
  recipientName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  certificateBody: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 1.8,
    marginBottom: 40,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  detailItem: {
    flex: 1,
    marginHorizontal: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 40,
  },
  signature: {
    alignItems: 'center',
  },
  signatureLine: {
    width: 150,
    height: 1,
    backgroundColor: '#333',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 12,
    color: '#666',
  },
  certificateNumber: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

interface GAPPCertificateProps {
  userName: string;
  certificateNumber: string;
  enrollmentDate: string;
  expiryDate?: string;
}

export const GAPPCertificate: React.FC<GAPPCertificateProps> = ({
  userName,
  certificateNumber,
  enrollmentDate,
  expiryDate,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/images/nexus-logo.svg" />
          <View style={styles.certificateNumber}>
            <Text>Certificate #{certificateNumber}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Genuine Apple Parts Program</Text>
        <Text style={styles.certificateText}>Certificate of Enrollment</Text>

        {/* Recipient Name */}
        <Text style={styles.recipientName}>{userName}</Text>

        {/* Certificate Body */}
        <Text style={styles.certificateBody}>
          This is to certify that the above named individual has successfully enrolled in the
          Genuine Apple Parts Program (GAPP) with Midas Technical Solutions. This certification confirms
          participation in our premium core returns program, ensuring access to genuine Apple
          parts and components for repair and refurbishment services.
        </Text>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Enrollment Date</Text>
            <Text style={styles.detailValue}>{enrollmentDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Certificate Number</Text>
            <Text style={styles.detailValue}>{certificateNumber}</Text>
          </View>
          {expiryDate && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Valid Until</Text>
              <Text style={styles.detailValue}>{expiryDate}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Authorized Signature</Text>
            <Text style={styles.signatureText}>Midas Technical Solutions</Text>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Date Issued</Text>
            <Text style={styles.signatureText}>{enrollmentDate}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
