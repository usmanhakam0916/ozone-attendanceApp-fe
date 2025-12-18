import React from 'react';
import { Typography, Card, Space } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card>
        <Typography>
          <Title level={2}>Privacy Policy for Ozone Clinics App</Title>

          <Paragraph>
            At Ozone Clinics, accessible from{' '}
            <Link href="https://attendance-portal.ozoneclinic-sa.com/user/login" target="_blank">
              https://attendance-portal.ozoneclinic-sa.com
            </Link>
            , one of our main priorities is the privacy of our visitors. This Privacy Policy
            document contains types of information that is collected and recorded by Ozone Clinics
            and how we use it.
          </Paragraph>

          <Paragraph>
            If you have additional questions or require more information about our Privacy Policy,
            do not hesitate to contact us.
          </Paragraph>

          <Paragraph>
            This Privacy Policy applies only to our online activities and is valid for visitors to
            our website with regards to the information that they shared and/or collect in Ozone
            Clinics. This policy is not applicable to any information collected offline or via
            channels other than this website.
          </Paragraph>

          <Paragraph>
            By using our website, you hereby agree to our Privacy Policy and agree to its terms.
          </Paragraph>

          <Title level={3}>Information we collect</Title>

          <Paragraph>
            The personal information that you are asked to provide, and the reasons why you are
            asked to provide it, will be made clear to you at the point we ask you to provide your
            personal information.
          </Paragraph>

          <Paragraph>
            If you contact us directly, we may receive additional information about you such as your
            name, email address, phone number, the contents of the message and/or attachments you
            may send us, and any other information you may choose to provide.
          </Paragraph>

          <Paragraph>
            When you register for an Account, we may ask for your contact information, including
            items such as name, company name, address, email address, and telephone number.
          </Paragraph>

          <Title level={3}>Advertising Partners Privacy Policies</Title>

          <Paragraph>
            You may consult this list to find the Privacy Policy for each of the advertising
            partners of Ozone Clinics.
          </Paragraph>

          <Paragraph>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web
            Beacons that are used in their respective advertisements and links that appear on Ozone
            Clinics, which are sent directly to users browser. They automatically receive your IP
            address when this occurs. These technologies are used to measure the effectiveness of
            their advertising campaigns and/or to personalize the advertising content that you see
            on websites that you visit.
          </Paragraph>

          <Paragraph>
            Note that Ozone Clinics has no access to or control over these cookies that are used by
            third-party advertisers.
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
