import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface InvoicePaidEmailProps {
    invoiceId: string;
    amount: string;
    date: string;
    customerName: string;
}

export const InvoicePaidEmail = ({
    invoiceId,
    amount,
    date,
    customerName,
}: InvoicePaidEmailProps) => (
    <Html>
        <Head />
        <Preview>Invoice #{invoiceId} Payment Confirmation</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={heading}>Payment Received</Heading>
                <Text style={paragraph}>Hi {customerName},</Text>
                <Text style={paragraph}>
                    This is a confirmation that we have received your payment for Invoice #{invoiceId}.
                </Text>
                <Section style={details}>
                    <Text style={detailText}>Amount Paid: <strong>{amount}</strong></Text>
                    <Text style={detailText}>Date: {date}</Text>
                </Section>
                <Hr style={hr} />
                <Text style={footer}>
                    Thank you for your business.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default InvoicePaidEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
};

const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 0 0",
};

const paragraph = {
    margin: "0 0 15px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#3c4149",
};

const details = {
    margin: "24px 0",
};

const detailText = {
    margin: "0 0 10px",
    fontSize: "15px",
    color: "#3c4149",
};

const hr = {
    borderColor: "#dfe1e4",
    margin: "42px 0 26px",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
};
