"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Calculator,
  Scale,
  Gift,
  KeyRound,
  Coins,
  Building2,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

declare global {
  interface Window {
    __imperialOpenTool?: (toolKey: string) => void;
    __imperialCloseTool?: () => void;
  }
}

type ToolKey = "share" | "wacc" | "bonus" | "rights" | "dividend" | "ipo";

interface Tool {
  key: ToolKey;
  icon: LucideIcon;
  name: string;
  shortName: string;
}

const tools: Tool[] = [
  { key: "share", icon: Calculator, name: "Share Calculator", shortName: "Share" },
  { key: "wacc", icon: Scale, name: "WACC Calculator", shortName: "WACC" },
  { key: "bonus", icon: Gift, name: "Bonus Adj Calculator", shortName: "Bonus" },
  { key: "rights", icon: KeyRound, name: "Right Adj Calculator", shortName: "Rights" },
  { key: "dividend", icon: Coins, name: "Dividend Calculator", shortName: "Dividend" },
  { key: "ipo", icon: Building2, name: "IPO Allotment Check", shortName: "IPO" },
];

// ─── UI Primitives ────────────────────────────────────────────────────────────

function InputField({
  label, value, onChange, prefix, suffix,
  placeholder = "0", readOnly = false,
}: {
  label: string; value: string | number; onChange?: (v: string) => void;
  prefix?: string; suffix?: string; placeholder?: string; readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-[2px] text-brand-gray">{label}</label>
      <div
        className={`flex items-center rounded-lg border ${
          readOnly ? "border-brand-blue/15 bg-brand-blue-lt/40" : "border-border bg-white"
        }`}
      >
        {prefix && (
          <span className="pl-3 text-[13px] font-medium text-brand-gray select-none">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full bg-transparent px-3 py-2.5 text-[13px] outline-none placeholder:text-brand-gray/50 ${
            readOnly ? "font-bold text-brand-blue" : "font-medium text-foreground"
          }`}
        />
        {suffix && (
          <span className="pr-3 text-[12px] font-medium text-brand-gray select-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function SelectInput({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-[2px] text-brand-gray">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-lg border border-border bg-white px-3 py-2.5 text-[13px] font-medium text-foreground outline-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function PillToggle({
  options, value, onChange,
}: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors ${
            value === o
              ? "bg-brand-blue text-white"
              : "border border-border bg-white text-brand-gray hover:border-brand-blue/30 hover:text-brand-blue"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-1 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-bold uppercase tracking-[2px] text-brand-gray">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ResultCard({
  label, value, highlight = false, green = false, red = false,
}: {
  label: string; value: string; highlight?: boolean; green?: boolean; red?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 ${
        highlight ? "bg-brand-blue-lt/60" : "bg-brand-gray-lt/50"
      }`}
    >
      <span className="text-[12px] text-brand-gray">{label}</span>
      <span
        className={`text-[13px] font-bold ${
          green ? "text-brand-green-dk" : red ? "text-red-600" : highlight ? "text-brand-blue" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ResultSection({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-6 text-center text-[13px] leading-relaxed text-brand-gray">{children}</p>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. SHARE CALCULATOR
// ══════════════════════════════════════════════════════════════════════════════
function ShareCalc() {
  const [shareType,    setShareType]    = useState<"equity"|"mutual fund"|"debenture">("equity");
  const [tranType,     setTranType]     = useState<"buy"|"sell">("buy");
  const [qty,          setQty]          = useState("");
  const [buyPrice,     setBuyPrice]     = useState("");
  const [sellPrice,    setSellPrice]    = useState("");
  const [investorType, setInvestorType] = useState<"individual"|"institutional">("individual");
  const [cgtRate,      setCgtRate]      = useState("5");

  const q  = parseFloat(qty)       || 0;
  const bp = parseFloat(buyPrice)  || 0;
  const sp = parseFloat(sellPrice) || 0;
  const DP = 25;

  // Results only visible when qty + relevant price are set
  const buyReady  = q > 0 && bp > 0;
  const sellReady = q > 0 && bp > 0 && sp > 0;
  const showResults = tranType === "buy" ? buyReady : sellReady;

  function getCommission(amount: number): number {
    if (shareType === "equity") {
      if (amount <= 50000)    return Math.max(amount * 0.0036, 10);
      if (amount <= 500000)   return amount * 0.0033;
      if (amount <= 2000000)  return amount * 0.0031;
      if (amount <= 10000000) return amount * 0.0027;
      return amount * 0.0024;
    }
    if (shareType === "mutual fund") {
      if (amount <= 500000)  return Math.max(amount * 0.0015, 10);
      if (amount <= 5000000) return amount * 0.0012;
      return amount * 0.001;
    }
    if (amount <= 500000)  return Math.max(amount * 0.001, 10);
    if (amount <= 5000000) return amount * 0.0005;
    return amount * 0.0002;
  }

  const totalAmount = tranType === "buy" ? q * bp : q * sp;
  const commission  = getCommission(totalAmount);
  const sebonFee    = (totalAmount * (shareType === "equity" ? 0.015 : 0.01)) / 100;
  const brokerComm  = commission * 0.794;
  const nepseComm   = commission * 0.20;
  const sebonRegFee = commission * 0.006;

  // BUY
  const totalPayable = totalAmount + commission + sebonFee + DP;
  const costPerShare = q > 0 ? totalPayable / q : 0;

  // SELL
  const cgt        = parseFloat(cgtRate) / 100;
  const netSell    = totalAmount - commission - sebonFee - DP;
  const buyCost    = q * bp + commission + sebonFee + DP;
  const cgtWOWacc  = (netSell - buyCost) * cgt;
  const cgtWWacc   = (totalAmount - commission - sebonFee - DP - q * bp) * cgt;
  const receivable = netSell - cgtWOWacc;
  const profitLoss = receivable - q * bp;

  const fmt = (n: number) => isNaN(n) ? "0.00" : n.toFixed(2);

  return (
    <div className="flex flex-col gap-5">
      {/* Share type */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[2px] text-brand-gray">Share Type</span>
        <PillToggle options={["equity","mutual fund","debenture"]} value={shareType} onChange={v => setShareType(v as typeof shareType)} />
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-brand-gray-lt/50 p-1">
        {(["buy","sell"] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTranType(t)}
            className={`rounded-md py-2.5 text-[13px] font-semibold capitalize transition-colors ${
              tranType === t
                ? t === "buy" ? "bg-brand-green-dk text-white" : "bg-red-600 text-white"
                : "text-brand-gray hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Share Quantity" value={qty} onChange={setQty} placeholder="e.g. 100" />
        <InputField label="Purchase Price" value={buyPrice} onChange={setBuyPrice} prefix="Rs." placeholder="0.00" />
        {tranType === "sell" && (
          <InputField label="Selling Price" value={sellPrice} onChange={setSellPrice} prefix="Rs." placeholder="0.00" />
        )}
      </div>

      {tranType === "sell" && (
        <div className="grid grid-cols-2 gap-3">
          <SelectInput label="Investor Type" value={investorType} onChange={v => setInvestorType(v as any)}
            options={[{value:"individual",label:"Individual"},{value:"institutional",label:"Institutional"}]} />
          {investorType === "individual" && (
            <SelectInput label="Capital Gain Tax" value={cgtRate} onChange={setCgtRate}
              options={[{value:"5",label:"5%"},{value:"7.5",label:"7.5%"}]} />
          )}
        </div>
      )}

      {showResults && (
          <ResultSection>
            <Divider label="Charges" />
            <ResultCard label="Total Amount"    value={`Rs. ${fmt(totalAmount)}`} />
            <ResultCard label="Commission"      value={`Rs. ${fmt(commission)}`} />
            <ResultCard label="SEBON Fee"       value={`Rs. ${fmt(sebonFee)}`} />
            <ResultCard label="DP Charge"       value={`Rs. ${DP}.00`} />

            {tranType === "buy" && <>
              <Divider label="Summary" />
              <ResultCard label="Total Amount Payable" value={`Rs. ${fmt(totalPayable)}`} highlight />
              <ResultCard label="Cost Per Share"       value={`Rs. ${fmt(costPerShare)}`} highlight />
            </>}

            {tranType === "sell" && <>
              <Divider label="Capital Gain Tax" />
              <ResultCard label="CGT Without WACC" value={`Rs. ${fmt(cgtWOWacc)}`} />
              <ResultCard label="CGT With WACC"    value={`Rs. ${fmt(cgtWWacc)}`} />
              <Divider label="Summary" />
              <ResultCard label="Total Amount Receivable" value={`Rs. ${fmt(receivable)}`} highlight />
              <ResultCard label="Profit / Loss"           value={`Rs. ${fmt(profitLoss)}`} highlight green={profitLoss >= 0} red={profitLoss < 0} />
            </>}

            <Divider label="Commission Breakdown" />
            <ResultCard label="Broker Commission (79.4%)" value={`Rs. ${fmt(brokerComm)}`} />
            <ResultCard label="NEPSE Commission (20%)"    value={`Rs. ${fmt(nepseComm)}`} />
            <ResultCard label="SEBON Regulatory Fee (0.6%)" value={`Rs. ${fmt(sebonRegFee)}`} />
          </ResultSection>
        )}

      {!showResults && (
        <EmptyHint>
          {tranType === "sell" && !sellReady
            ? "Enter quantity, purchase price, and selling price to see results."
            : "Enter share quantity and purchase price to see results."}
        </EmptyHint>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. WACC CALCULATOR
// ══════════════════════════════════════════════════════════════════════════════
type WaccRow = { stock_type: string; quantity: string; rate: string };

function WACCCalc() {
  const [rows, setRows] = useState<WaccRow[]>([{ stock_type: "secondary", quantity: "", rate: "" }]);
  const DP  = 25;

  function calcTotal(qty: number, rate: number, type: string): number {
    const tp = qty * rate;
    if (type === "secondary" && tp > 0) {
      let comm = 0;
      if (tp <= 50000)         comm = Math.max(tp * 0.0036, 10);
      else if (tp <= 500000)   comm = tp * 0.0033;
      else if (tp <= 2000000)  comm = tp * 0.0031;
      else if (tp <= 10000000) comm = tp * 0.0027;
      else                     comm = tp * 0.0024;
      return comm + tp + (tp * 0.015) / 100 + DP;
    }
    return tp;
  }

  let totalWeightedSum = 0;
  let totalQty = 0;
  const rowTotals = rows.map(r => {
    const q    = parseFloat(r.quantity) || 0;
    const rate = parseFloat(r.rate)     || 0;
    const tot  = calcTotal(q, rate, r.stock_type);
    totalWeightedSum += tot;
    totalQty         += q;
    return tot;
  });
  const wacc = totalQty > 0 ? (totalWeightedSum / totalQty).toFixed(2) : "—";

  function updateRow(i: number, field: keyof WaccRow, val: string) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }

  const stockOptions = [
    { value: "ipo",       label: "IPO"       },
    { value: "secondary", label: "Secondary" },
    { value: "right",     label: "Right"     },
    { value: "bonus",     label: "Bonus"     },
    { value: "auction",   label: "Auction"   },
  ];

  return (
    <div className="flex flex-col gap-4">
      {rows.map((r, i) => {
        const q    = parseFloat(r.quantity) || 0;
        const rate = parseFloat(r.rate)     || 0;
        const tot  = q && rate ? rowTotals[i].toFixed(2) : "";
        return (
          <div key={i} className="flex flex-col gap-3 rounded-lg border border-border bg-brand-gray-lt/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-blue text-[11px] font-bold text-white">
                  {i + 1}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gray">Lot {i + 1}</span>
              </div>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => setRows(p => p.filter((_, idx) => idx !== i))}
                  className="text-[11px] font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="col-span-2">
                <SelectInput label="Stock Type" value={r.stock_type}
                  onChange={v => updateRow(i, "stock_type", v)} options={stockOptions} />
              </div>
              <InputField label="Quantity" value={r.quantity} onChange={v => updateRow(i, "quantity", v)} placeholder="0" />
              <InputField label="Rate" value={r.rate} onChange={v => updateRow(i, "rate", v)} prefix="Rs." placeholder="0.00" />
              {tot && (
                <div className="col-span-2">
                  <InputField label="Total Cost (auto)" value={tot} readOnly prefix="Rs." />
                </div>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => setRows(p => [...p, { stock_type: "secondary", quantity: "", rate: "" }])}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-brand-blue/40 px-4 py-3 text-[12.5px] font-semibold text-brand-blue transition-colors hover:bg-brand-blue-lt/50"
      >
        + Add Another Lot
      </button>

      <div className="flex items-center justify-between rounded-lg bg-brand-blue-lt/50 px-4 py-4">
        <div>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[2px] text-brand-blue">
            Weighted Avg Price
          </div>
          <div className="text-[11px] text-brand-gray">WACC = Σ(Total) ÷ Σ(Quantity)</div>
        </div>
        <div className="text-[24px] font-extrabold text-brand-blue">
          {wacc !== "—" ? `Rs. ${wacc}` : "—"}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. BONUS ADJ CALCULATOR
// ══════════════════════════════════════════════════════════════════════════════
function BonusCalc() {
  const [mktPrice, setMktPrice] = useState("");
  const [bonusPct, setBonusPct] = useState("");

  const MP  = parseFloat(mktPrice) || 0;
  const BP  = parseFloat(bonusPct) || 0;
  const adj = MP > 0 && BP > 0 ? (MP / (1 + BP / 100)).toFixed(2) : "";
  const diff = adj ? (parseFloat(adj) - MP).toFixed(2) : "";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3">
        <InputField label="Market Price (Before Book Closure)" value={mktPrice} onChange={setMktPrice} prefix="Rs." placeholder="0.00" />
        <InputField label="Bonus Share (%)" value={bonusPct} onChange={setBonusPct} suffix="%" placeholder="e.g. 20" />
      </div>

      {adj ? (
          <ResultSection>
            <Divider label="Result" />
            <ResultCard label="Price Before Adjustment" value={`Rs. ${MP.toFixed(2)}`} />
            <ResultCard label="Adjusted Market Price"   value={`Rs. ${adj}`} highlight />
            <ResultCard label="Price Difference"        value={`Rs. ${diff}`} red />
          </ResultSection>
        ) : (
        <EmptyHint>Enter market price and bonus percentage to see the adjusted price.</EmptyHint>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. RIGHT SHARE ADJ CALCULATOR
// ══════════════════════════════════════════════════════════════════════════════
function RightsCalc() {
  const [paidUp,   setPaidUp]   = useState("100");
  const [mktPrice, setMktPrice] = useState("");
  const [rightPct, setRightPct] = useState("");

  const PV  = parseFloat(paidUp)   || 0;
  const MP  = parseFloat(mktPrice) || 0;
  const RP  = parseFloat(rightPct) || 0;
  const adj = MP > 0 && RP > 0 ? ((MP + (PV * RP) / 100) / (1 + RP / 100)).toFixed(2) : "";
  const diff = adj ? (parseFloat(adj) - MP).toFixed(2) : "";

  return (
    <div className="flex flex-col gap-5">
      <SelectInput label="Paid Up Value" value={paidUp} onChange={setPaidUp}
        options={[{value:"10",label:"Rs. 10"},{value:"100",label:"Rs. 100"}]} />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Market Price (Before Book Closure)" value={mktPrice} onChange={setMktPrice} prefix="Rs." placeholder="0.00" />
        <InputField label="Right Share (%)" value={rightPct} onChange={setRightPct} suffix="%" placeholder="e.g. 20" />
      </div>

      {adj ? (
          <ResultSection>
            <Divider label="Result" />
            <ResultCard label="Price Before Adjustment" value={`Rs. ${MP.toFixed(2)}`} />
            <ResultCard label="Adjusted Market Price"   value={`Rs. ${adj}`} highlight />
            <ResultCard label="Price Difference"        value={`Rs. ${diff}`} red />
          </ResultSection>
        ) : (
        <EmptyHint>Enter market price and right share percentage to see the adjusted price.</EmptyHint>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. DIVIDEND CALCULATOR
// ══════════════════════════════════════════════════════════════════════════════
function DividendCalc() {
  const [paidUp,   setPaidUp]   = useState("100");
  const [qty,      setQty]      = useState("");
  const [bonusPct, setBonusPct] = useState("");
  const [cashPct,  setCashPct]  = useState("");

  const PV  = parseFloat(paidUp)   || 0;
  const QTY = parseFloat(qty)      || 0;
  const BD  = parseFloat(bonusPct) || 0;
  const CD  = parseFloat(cashPct)  || 0;

  const cashAmount       = ((QTY * CD) / 100) * PV;
  const bonusDividendAmt = (((QTY * BD) / 100) * PV * 5) / 100;
  const cashDividendAmt  = (cashAmount * 5) / 100;
  const totalTax         = bonusDividendAmt + cashDividendAmt;
  const bonusQty         = (QTY * BD) / 100;
  const showResults      = QTY > 0 && (BD > 0 || CD > 0);

  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="flex flex-col gap-5">
      <SelectInput label="Paid Up Value" value={paidUp} onChange={setPaidUp}
        options={[{value:"10",label:"Rs. 10"},{value:"100",label:"Rs. 100"}]} />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Share Quantity"     value={qty}      onChange={setQty}      placeholder="e.g. 100" />
        <InputField label="Bonus Dividend (%)" value={bonusPct} onChange={setBonusPct} suffix="%" placeholder="0" />
        <InputField label="Cash Dividend (%)"  value={cashPct}  onChange={setCashPct}  suffix="%" placeholder="0" />
      </div>

      {showResults ? (
          <ResultSection>
            <Divider label="Details" />
            <ResultCard label="Cash Amount"               value={`Rs. ${fmt(cashAmount)}`} />
            <ResultCard label={`Bonus Share Tax (${BD}%)`} value={`Rs. ${fmt(bonusDividendAmt)}`} />
            <ResultCard label={`Cash Amount Tax (${CD}%)`} value={`Rs. ${fmt(cashDividendAmt)}`} />
            <Divider label="Summary" />
            <ResultCard label="Total Payable Tax"          value={`Rs. ${fmt(totalTax)}`}     highlight />
            <ResultCard label="Receivable Bonus Quantity"  value={`${fmt(bonusQty)} shares`}  highlight />
          </ResultSection>
        ) : (
        <EmptyHint>Enter share quantity and dividend percentages to see the breakdown.</EmptyHint>
      )}
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
const calcMap: Record<Exclude<ToolKey, "ipo">, { Component: React.ComponentType; title: string; subtitle: string }> = {
  share:    { Component: ShareCalc,    title: "Share Calculator",     subtitle: "NEPSE equity trading calculator" },
  wacc:     { Component: WACCCalc,     title: "WACC Calculator",      subtitle: "Weighted average cost per share" },
  bonus:    { Component: BonusCalc,    title: "Bonus Adj Calculator", subtitle: "Post-bonus price adjustment" },
  rights:   { Component: RightsCalc,   title: "Right Adj Calculator", subtitle: "Post-rights price adjustment" },
  dividend: { Component: DividendCalc, title: "Dividend Calculator",  subtitle: "Dividend and tax breakdown" },
};

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ToolsSection() {
  const [active, setActive] = useState<ToolKey>("share");

  const selectTool = useCallback((k: ToolKey) => {
    setActive(k);
  }, []);

  useEffect(() => {
    window.__imperialOpenTool = (toolKey: string) => {
      if (tools.some(t => t.key === toolKey)) {
        selectTool(toolKey as ToolKey);
        document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.__imperialCloseTool = () => selectTool("share");

    const pendingTool = sessionStorage.getItem("imperial-open-tool");
    if (pendingTool && tools.some(t => t.key === pendingTool)) {
      setActive(pendingTool as ToolKey);
      sessionStorage.removeItem("imperial-open-tool");
    } else {
      const params = new URLSearchParams(window.location.search);
      const urlTool = params.get("tool");
      if (urlTool && tools.some(t => t.key === urlTool)) {
        setActive(urlTool as ToolKey);
      }
    }

    return () => {
      if (window.__imperialOpenTool) delete window.__imperialOpenTool;
      if (window.__imperialCloseTool) delete window.__imperialCloseTool;
    };
  }, [selectTool]);

  const activeCalc = active !== "ipo" ? calcMap[active] : null;
  const ActiveComponent = activeCalc?.Component;

  return (
    <section
      id="tools"
      className="bg-gradient-to-b from-white via-white to-brand-gray-lt/80 px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground">
            NEPSE{" "}
            <span className="text-brand-green-dk">Tools</span>
          </h2>
          <p className="mt-3 text-[15px] leading-[1.72] text-brand-gray">
            Estimate charges, adjustments, and tax on NEPSE trades using our built-in calculators.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
          <nav aria-label="Calculator tools" className="lg:sticky lg:top-24 lg:self-start">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:hidden">
              {tools.map((t) => {
                const isActive = active === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => selectTool(t.key)}
                    aria-current={isActive ? "true" : undefined}
                    className={`rounded-md border px-2.5 py-2.5 text-center text-[12px] font-semibold leading-tight transition-colors sm:px-3 sm:text-[13px] ${
                      isActive
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-border bg-white text-foreground hover:border-brand-blue/40"
                    }`}
                  >
                    {t.shortName}
                  </button>
                );
              })}
            </div>

            <ul className="hidden flex-col gap-0.5 lg:flex">
              {tools.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.key;
                return (
                  <li key={t.key}>
                    <button
                      type="button"
                      onClick={() => selectTool(t.key)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-brand-blue text-white"
                          : "text-foreground hover:bg-brand-blue-lt/40"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                      {t.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-white">
            <div className="border-b border-border px-4 py-3 sm:px-5">
              {active === "ipo" ? (
                <>
                  <h3 className="text-[15px] font-bold text-foreground sm:text-[16px]">IPO Allotment Check</h3>
                  <p className="mt-0.5 text-[12px] text-brand-gray sm:text-[13px]">Official CDSC IPO results portal</p>
                </>
              ) : activeCalc ? (
                <>
                  <h3 className="text-[15px] font-bold text-foreground sm:text-[16px]">{activeCalc.title}</h3>
                  <p className="mt-0.5 text-[12px] text-brand-gray sm:text-[13px]">{activeCalc.subtitle}</p>
                </>
              ) : null}
            </div>

            <div className="max-h-[min(70vh,640px)] overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
              {active === "ipo" ? (
                <div className="flex flex-col items-start gap-4">
                  <p className="max-w-md text-[14px] leading-relaxed text-brand-gray">
                    View your IPO allotment results on the official CDSC portal using your applicant number or DEMAT details.
                  </p>
                  <a
                    href="https://iporesult.cdsc.com.np/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-blue-dk"
                  >
                    Open CDSC IPO Results
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : ActiveComponent ? (
                <ActiveComponent />
              ) : null}
            </div>

            <div className="border-t border-border bg-brand-gray-lt/40 px-4 py-3 sm:px-5">
              <p className="text-[11px] leading-relaxed text-brand-gray">
                For informational purposes only. Verify figures with a SEBON/NEPSE advisor before trading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}