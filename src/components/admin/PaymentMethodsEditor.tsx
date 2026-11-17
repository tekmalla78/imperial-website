"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MediaUploadField } from "./MediaUploadField";
import { RichTextEditor } from "./RichTextEditor";
import { Plus, Trash2 } from "lucide-react";
import {
  DEFAULT_PAYMENT_METHODS,
  parsePaymentMethods,
  type PaymentMethod,
} from "@/cms/payment-methods";

export type { PaymentMethod } from "@/cms/payment-methods";
export { parsePaymentMethods } from "@/cms/payment-methods";

const emptyMethod = (): PaymentMethod => ({
  name: "",
  desc: "",
  tag: "",
  accent: "#1557C0",
  accentLight: "#DBEAFE",
  icon: "",
  website: "",
  body: "",
});

export function PaymentMethodsEditor({
  name,
  label,
  value,
  hint,
}: {
  name: string;
  label: string;
  value?: unknown;
  hint?: string;
}) {
  const [methods, setMethods] = useState<PaymentMethod[]>(() => {
    const parsed = parsePaymentMethods(value);
    return parsed.length ? parsed : DEFAULT_PAYMENT_METHODS;
  });

  function update(index: number, patch: Partial<PaymentMethod>) {
    setMethods((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function remove(index: number) {
    setMethods((prev) => prev.filter((_, i) => i !== index));
  }

  function add() {
    setMethods((prev) => [...prev, emptyMethod()]);
  }

  return (
    <div className="grid gap-3">
      <div>
        <Label>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-brand-gray">{hint}</p> : null}
      </div>
      <input type="hidden" name={name} value={JSON.stringify(methods)} />
      <div className="grid gap-4">
        {methods.map((method, index) => (
          <div key={index} className="rounded-xl border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {method.name.trim() || `Method ${index + 1}`}
              </p>
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Name</Label>
                <Input
                  value={method.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                  className="h-11 bg-white"
                  placeholder="eSewa"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Card tag</Label>
                <Input
                  value={method.tag}
                  onChange={(e) => update(index, { tag: e.target.value })}
                  className="h-11 bg-white"
                  placeholder="Digital Wallet"
                />
              </div>
              <div className="grid gap-1.5 md:col-span-2">
                <Label>Short description (on card)</Label>
                <Input
                  value={method.desc}
                  onChange={(e) => update(index, { desc: e.target.value })}
                  className="h-11 bg-white"
                  placeholder="Digital wallet payment"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Accent color</Label>
                <Input
                  value={method.accent}
                  onChange={(e) => update(index, { accent: e.target.value })}
                  className="h-11 bg-white"
                  placeholder="#60BB46"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Accent light</Label>
                <Input
                  value={method.accentLight}
                  onChange={(e) => update(index, { accentLight: e.target.value })}
                  className="h-11 bg-white"
                  placeholder="#DCFCE7"
                />
              </div>
              <div className="grid gap-1.5 md:col-span-2">
                <Label>Website (optional CTA)</Label>
                <Input
                  type="url"
                  value={method.website}
                  onChange={(e) => update(index, { website: e.target.value })}
                  className="h-11 bg-white"
                  placeholder="https://"
                />
              </div>
              <div className="md:col-span-2">
                <MediaUploadField
                  label="Logo / icon"
                  value={method.icon}
                  kind="image"
                  hint="Shown on the card and popup header."
                  onChange={(url) => update(index, { icon: url })}
                />
              </div>
              <div className="md:col-span-2">
                <RichTextEditor
                  label="Popup content"
                  value={method.body}
                  onChange={(html) => update(index, { body: html })}
                  hint="Steps, account details, or QR images for this method. Use Insert image for QR codes."
                  placeholder="Add steps, account numbers, or a QR code…"
                  minHeightClass="min-h-[160px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-dashed border-brand-blue/40 bg-brand-blue-lt/40 px-4 text-sm font-semibold text-brand-blue hover:border-brand-blue"
      >
        <Plus className="h-4 w-4" /> Add payment method
      </button>
    </div>
  );
}
