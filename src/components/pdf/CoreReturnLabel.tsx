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
    fontFamily: 'Roboto',
  },
  container: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: 1,
    borderBottomColor: '#000',
  },
  logo: {
    width: 80,
    height: 30,
  },
  serviceType: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  trackingSection: {
    marginBottom: 15,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  barcode: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 10,
    textAlign: 'center',
  },
  addresses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addressBlock: {
    flex: 1,
    padding: 8,
    marginHorizontal: 5,
  },
  fromAddress: {
    border: 1,
    borderColor: '#000',
  },
  toAddress: {
    border: 1,
    borderColor: '#000',
  },
  addressLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  addressText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  serviceItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  serviceLabel: {
    fontSize: 8,
    color: '#666',
  },
  serviceValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  qrCode: {
    width: 60,
    height: 60,
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 8,
    textAlign: 'center',
  },
  footer: {
    borderTop: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#666',
  },
  weightInfo: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

interface CoreReturnLabelProps {
  trackingNumber: string;
  fromAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  toAddress: {
    name: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  serviceType: string;
  weight: string;
  shipDate: string;
  reference?: string;
}

export const CoreReturnLabel: React.FC<CoreReturnLabelProps> = ({
  trackingNumber,
  fromAddress,
  toAddress,
  serviceType,
  weight,
  shipDate,
  reference,
}) => {
  // Generate fake barcode pattern (in real implementation, use a proper barcode library)
  const generateFakeBarcode = (tracking: string) => {
    return `|| ${tracking} ||`;
  };

  return (
    <Document>
      <Page size={[576, 384]} style={styles.page}> {/* 9x4 inches at 72 DPI */}
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image style={styles.logo} src="/images/nexus-logo.svg" />
            <Text style={styles.serviceType}>{serviceType}</Text>
            <View style={styles.qrCode}>
              <Text style={styles.qrText}>QR CODE</Text>
            </View>
          </View>

          {/* Tracking Section */}
          <View style={styles.trackingSection}>
            <Text style={styles.trackingNumber}>{trackingNumber}</Text>
            <View style={styles.barcode}>
              <Text style={styles.barcodeText}>{generateFakeBarcode(trackingNumber)}</Text>
            </View>
          </View>

          {/* Addresses */}
          <View style={styles.addresses}>
            <View style={styles.addressBlock}>
              <View style={styles.fromAddress}>
                <Text style={styles.addressLabel}>FROM:</Text>
                <Text style={styles.addressText}>{fromAddress.name}</Text>
                <Text style={styles.addressText}>{fromAddress.company}</Text>
                <Text style={styles.addressText}>{fromAddress.address}</Text>
                <Text style={styles.addressText}>
                  {fromAddress.city}, {fromAddress.state} {fromAddress.zip}
                </Text>
              </View>
            </View>
            <View style={styles.addressBlock}>
              <View style={styles.toAddress}>
                <Text style={styles.addressLabel}>TO:</Text>
                <Text style={styles.addressText}>{toAddress.name}</Text>
                <Text style={styles.addressText}>{toAddress.company}</Text>
                <Text style={styles.addressText}>{toAddress.address}</Text>
                <Text style={styles.addressText}>
                  {toAddress.city}, {toAddress.state} {toAddress.zip}
                </Text>
              </View>
            </View>
          </View>

          {/* Service Info */}
          <View style={styles.serviceInfo}>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceLabel}>Service</Text>
              <Text style={styles.serviceValue}>{serviceType}</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceLabel}>Weight</Text>
              <Text style={styles.serviceValue}>{weight}</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceLabel}>Ship Date</Text>
              <Text style={styles.serviceValue}>{shipDate}</Text>
            </View>
            {reference && (
              <View style={styles.serviceItem}>
                <Text style={styles.serviceLabel}>Reference</Text>
                <Text style={styles.serviceValue}>{reference}</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Core Return - Midas Technical Solutions</Text>
            <Text style={styles.footerText}>Generated: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
