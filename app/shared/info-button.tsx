import { Tooltip, Icon } from "@shopify/polaris";
import { InfoIcon } from "@shopify/polaris-icons";

interface InfoButtonProps {
  content: string;
}

export function InfoButton({ content }: InfoButtonProps) {
  return (
    <Tooltip content={content} dismissOnMouseOut>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          cursor: "pointer",
          color: "var(--p-color-text-info)",
          opacity: 0.7,
          transition: "opacity 0.15s",
          flexShrink: 0,
          lineHeight: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
      >
        <Icon source={InfoIcon} tone="info" />
      </span>
    </Tooltip>
  );
}
