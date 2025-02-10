
const QRCode = require('qrcode');

const data = 'https://youtube.com/shorts/wmdY7vicaVs?si=Yoi7G-Ew9Qcoy0As'; // The data or URL you want to encode

QRCode.toFile('eloufyqrcode.png', data, {
  color: {
    dark: '#000000',  // QR code dots color
    light: '#ffffff'  // Background color
  },
  errorCorrectionLevel: 'H' // High error correction level
}, function (err) {
  if (err) {
    console.error('Error generating QR code:', err);
  } else {
    console.log('QR code image saved as qrcode.png');
  }
});
