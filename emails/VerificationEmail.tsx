import * as React from 'react';
import { Html, Button } from "@react-email/components";

export default function VerificationEmail({ username, otp }: { username: string, otp: string }) {

    return (
        <Html lang="en" dir="ltr">
            <Button>Click me</Button>
        </Html>
    );
}
