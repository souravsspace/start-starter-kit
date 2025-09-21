import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { BaseEmail, styles } from "./components/BaseEmail";

interface SupportRequestEmailProps {
  name: string;
  email: string;
  type: "help" | "contact";
  category?: string;
  topic?: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
}

const priorityColors = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  urgent: "#dc2626",
};

const priorityLabels = {
  low: "Low Priority",
  medium: "Medium Priority",
  high: "High Priority",
  urgent: "Urgent",
};

export default function SupportRequestEmail({
  name,
  email,
  type,
  category,
  topic,
  subject,
  message,
  priority,
}: SupportRequestEmailProps) {
  const categoryOrTopic = category || topic || "General";

  return (
    <BaseEmail
      previewText={`New ${type} request: ${subject}`}
      footerText="This support request was submitted through the website contact form."
    >
      <div style={{
        backgroundColor: "#1e293b",
        color: "#ffffff",
        padding: "24px",
        borderRadius: "8px",
        textAlign: "center",
        marginBottom: "24px",
      }}>
        <Heading style={{
          ...styles.h1,
          color: "#ffffff",
          margin: "0 0 8px 0",
          fontSize: "24px",
        }}>
          New {type === "help" ? "Help" : "Contact"} Request
        </Heading>
        <span style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          backgroundColor: priorityColors[priority],
          color: "white",
        }}>
          {priorityLabels[priority]}
        </span>
      </div>

      <Section style={{ marginBottom: "24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}>
          <div>
            <Text style={{
              ...styles.text,
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 4px 0",
            }}>
              From:
            </Text>
            <Text style={{
              ...styles.text,
              fontSize: "16px",
              fontWeight: "600",
              color: "#1e293b",
              margin: "0 0 4px 0",
            }}>
              {name}
            </Text>
            <Text style={{
              ...styles.link,
              fontSize: "14px",
              display: "block",
            }}>
              {email}
            </Text>
          </div>
          <div>
            <Text style={{
              ...styles.text,
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              margin: "0 0 4px 0",
            }}>
              Category:
            </Text>
            <Text style={{
              ...styles.text,
              fontSize: "16px",
              fontWeight: "600",
              color: "#1e293b",
            }}>
              {categoryOrTopic.charAt(0).toUpperCase() + categoryOrTopic.slice(1)}
            </Text>
          </div>
        </div>

        <Hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />

        <div style={{ marginBottom: "16px" }}>
          <Text style={{
            ...styles.text,
            fontSize: "12px",
            fontWeight: "600",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 4px 0",
          }}>
            Subject:
          </Text>
          <Text style={{
            ...styles.text,
            fontSize: "18px",
            fontWeight: "600",
            color: "#1e293b",
            margin: "8px 0 0 0",
          }}>
            {subject}
          </Text>
        </div>

        <Hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />

        <div>
          <Text style={{
            ...styles.text,
            fontSize: "12px",
            fontWeight: "600",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 4px 0",
          }}>
            Message:
          </Text>
          <Text style={{
            ...styles.text,
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#475569",
            whiteSpace: "pre-wrap",
            margin: "8px 0 0 0",
          }}>
            {message}
          </Text>
        </div>
      </Section>

      <Section style={{ textAlign: "center", marginBottom: "24px" }}>
        <Button
          href={`mailto:${email}?subject=Re: ${subject}`}
          style={{
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            display: "inline-block",
          }}
        >
          Reply to {name}
        </Button>
      </Section>
    </BaseEmail>
  );
}