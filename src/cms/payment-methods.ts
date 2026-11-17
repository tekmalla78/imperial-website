export type PaymentMethod = {
  name: string;
  desc: string;
  tag: string;
  accent: string;
  accentLight: string;
  icon: string;
  website: string;
  body: string;
};

export function parsePaymentMethods(value: unknown): PaymentMethod[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as PaymentMethod[];
      if (Array.isArray(parsed)) {
        return parsed.map((row) => ({
          name: String(row.name ?? ""),
          desc: String(row.desc ?? ""),
          tag: String(row.tag ?? ""),
          accent: String(row.accent ?? "#1557C0"),
          accentLight: String(row.accentLight ?? "#DBEAFE"),
          icon: String(row.icon ?? ""),
          website: String(row.website ?? ""),
          body: String(row.body ?? ""),
        }));
      }
    } catch {
      /* fall through */
    }
  }
  return [];
}

/** Default methods matching live imperialsecurities.com.np Payment & Banking content. */
export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: "Global IME Bank",
    desc: "Direct bank deposit",
    tag: "Commercial Bank",
    accent: "#00529B",
    accentLight: "#DBEAFE",
    icon: "/uploads/payment-gbime.png",
    website: "https://www.gbime.com.np",
    body: `<ul>
<li>Name : Imperial securities Company Limited</li>
<li>Bank Name : Global IME Bank</li>
<li>Branch : Kamaladi</li>
<li>Account Number : 07501010000761</li>
</ul>`,
  },
  {
    name: "eSewa",
    desc: "Digital wallet payment",
    tag: "Digital Wallet",
    accent: "#60BB46",
    accentLight: "#DCFCE7",
    icon: "/uploads/payment-esewa.png",
    website: "https://esewa.com.np",
    body: `<p style="text-align: center"><a href="https://esewa.com.np" target="_blank" rel="noopener noreferrer"><img src="/uploads/payment-esewa-qr.png" alt="eSewa QR code" width="190" /></a></p>
<p style="text-align: center">Scan the QR code in your eSewa app to fund your trading account.</p>`,
  },
  {
    name: "FonePay",
    desc: "Mobile banking gateway",
    tag: "Mobile Gateway",
    accent: "#F7941D",
    accentLight: "#FEF3C7",
    icon: "/uploads/payment-fonepay.png",
    website: "https://fonepay.com",
    body: `<p style="text-align: center"><img src="/uploads/payment-fonepay-qr.png" alt="FonePay QR code" width="160" /></p>
<p style="text-align: center">Scan with any FonePay-linked mobile banking app to pay.</p>`,
  },
  {
    name: "IME Pay",
    desc: "Mobile money transfer",
    tag: "Mobile Money",
    accent: "#E31837",
    accentLight: "#FEE2E2",
    icon: "/uploads/payment-imepay.png",
    website: "https://imepay.com.np",
    body: `<p>IMEPAY</p>
<p>Transfer funds from your IME Pay wallet to Imperial Securities (Broker No. 45).</p>`,
  },
  {
    name: "ConnectIPS",
    desc: "Direct bank transfer",
    tag: "Bank Transfer",
    accent: "#C8102E",
    accentLight: "#FEE2E2",
    icon: "/uploads/payment-connectips.png",
    website: "https://www.connectips.com",
    body: `<ol>
<li>Login ConnectIPS</li>
<li>Financial Institution</li>
<li>Capital Market</li>
<li>Brokers Payment</li>
<li>Fill the payment details</li>
<li>Choose B.No. 45 Imperial Securities</li>
<li>Make payment</li>
</ol>`,
  },
];
