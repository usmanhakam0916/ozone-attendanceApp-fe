import React from 'react';
import QRCode from 'qrcode.react';
import qrCodeLogo from '../../../public/qrCode.svg';
import { Button } from 'antd';
import './style.css';

const locationPrint = () => {
  const params = new URL(window.location).searchParams;
  const location = params.get('location');
  const qrCode = params.get('qrcode').replace(/plus_sign/g, '+');

  return (
    <div style={{ padding: '1rem', height: '100%', backgroundColor: '#F0F2F5' }}>
      <div id="print">
        <div contenteditable="true">
          <img
            contenteditable="false"
            style={{ display: 'inline-block' }}
            width="100px"
            height="100px"
            src={qrCodeLogo}
            alt="qrCodeLogo"
          />
          <h1 style={{ display: 'inline-block', marginLeft: 10 }}>
            Welcome to QR based attendance tracking system - AGH-TAA
          </h1>
          <h2>How to register an attendance?</h2>
          <li>Download AGH-TAA mobile app from Playstore or App Store.</li>
          <li>Login with the user name and password shared by your IT department.</li>
          <li>Scan the below QR Code for Check-in and Checkout.</li>
        </div>
        <div className="qrcode-middle">
          <p style={{ marginBottom: 0 }}>Location: {location}*</p>
          <QRCode style={{ display: 'inline-block' }} value={qrCode} size={230} />
        </div>
        <div contenteditable="true">
          <h3>Please note:</h3>
          <p>
            This QR Code is location based. Whenever you move to new location/office, do scan the QR
            code that is available in that location for Check-in and Checkout, if you are allowed
            to.
          </p>
          <p style={{ textAlign: 'center', color: '#417DD8' }}>
            Any further help, reach out to IT department at it@OzoneCLinic.com.sa
          </p>
        </div>
      </div>
      <Button
        size="medium"
        style={{ float: 'right', marginRight: '1rem', backgroundColor: '#F8F8F8' }}
        onClick={() => window.print()}
      >
        Print
      </Button>
    </div>
  );
};

export default locationPrint;
