import * as React from 'react';
import { Html, Button,Head, Preview, Section, Row, Heading,Text } from "@react-email/components";

export default function VerificationEmail({ username, otp }: { username: string, otp: string }) {

    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
            </Head>
            <Preview>
            Here&apos;s your verification code : {otp}
            </Preview>
            <Section>
                <Row>
                    <Heading as="h2">
                            Hello, {username},
                    </Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering. Please use the following verification code to complete your registration : 
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
            </Section>
        </Html>
    );
}
