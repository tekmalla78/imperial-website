"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { MediaUploadField } from "./MediaUploadField";
import {
  parseLineList,
  parsePairList,
  parseTimelineList,
  parseTripleList,
  serializeLineList,
  serializePairList,
  serializeTimelineList,
  serializeTripleList,
  type PairRow,
  type TimelineRow,
  type TripleRow,
} from "@/cms/list-data";

function CardHeader({
  title,
  onRemove,
}: {
  title: string;
  onRemove: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-sm font-semibold">{title}</p>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" /> Remove
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-dashed border-brand-blue/40 bg-brand-blue-lt/40 px-4 text-sm font-semibold text-brand-blue hover:border-brand-blue"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

export function LinesListEditor({
  name,
  label,
  value,
  hint,
  itemLabel = "Item",
}: {
  name: string;
  label: string;
  value?: unknown;
  hint?: string;
  itemLabel?: string;
}) {
  const [rows, setRows] = useState<string[]>(() => {
    const parsed = parseLineList(value);
    return parsed.length ? parsed : [""];
  });

  return (
    <div className="grid gap-3">
      <div>
        <Label>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-brand-gray">{hint}</p> : null}
      </div>
      <input type="hidden" name={name} value={serializeLineList(rows)} />
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="rounded-xl border border-border bg-white p-4">
            <CardHeader
              title={`${itemLabel} ${index + 1}`}
              onRemove={() => setRows((prev) => prev.filter((_, i) => i !== index))}
            />
            <Input
              value={row}
              onChange={(e) =>
                setRows((prev) => prev.map((item, i) => (i === index ? e.target.value : item)))
              }
              className="h-11 bg-white"
            />
          </div>
        ))}
      </div>
      <AddButton label={`Add ${itemLabel.toLowerCase()}`} onClick={() => setRows((prev) => [...prev, ""])} />
    </div>
  );
}

export function PairsListEditor({
  name,
  label,
  value,
  hint,
  titleLabel = "Title",
  descLabel = "Description",
  itemLabel = "Item",
  descMultiline = true,
}: {
  name: string;
  label: string;
  value?: unknown;
  hint?: string;
  titleLabel?: string;
  descLabel?: string;
  itemLabel?: string;
  descMultiline?: boolean;
}) {
  const [rows, setRows] = useState<PairRow[]>(() => {
    const parsed = parsePairList(value);
    return parsed.length ? parsed : [{ title: "", desc: "" }];
  });

  function update(index: number, patch: Partial<PairRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="grid gap-3">
      <div>
        <Label>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-brand-gray">{hint}</p> : null}
      </div>
      <input type="hidden" name={name} value={serializePairList(rows)} />
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="rounded-xl border border-border bg-white p-4">
            <CardHeader
              title={`${itemLabel} ${index + 1}`}
              onRemove={() => setRows((prev) => prev.filter((_, i) => i !== index))}
            />
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label>{titleLabel}</Label>
                <Input
                  value={row.title}
                  onChange={(e) => update(index, { title: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>{descLabel}</Label>
                {descMultiline ? (
                  <Textarea
                    rows={3}
                    value={row.desc}
                    onChange={(e) => update(index, { desc: e.target.value })}
                    className="bg-white"
                  />
                ) : (
                  <Input
                    value={row.desc}
                    onChange={(e) => update(index, { desc: e.target.value })}
                    className="h-11 bg-white"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddButton
        label={`Add ${itemLabel.toLowerCase()}`}
        onClick={() => setRows((prev) => [...prev, { title: "", desc: "" }])}
      />
    </div>
  );
}

export function TriplesListEditor({
  name,
  label,
  value,
  hint,
  aLabel,
  bLabel,
  cLabel,
  itemLabel = "Item",
  cMultiline = false,
}: {
  name: string;
  label: string;
  value?: unknown;
  hint?: string;
  aLabel: string;
  bLabel: string;
  cLabel: string;
  itemLabel?: string;
  cMultiline?: boolean;
}) {
  const [rows, setRows] = useState<TripleRow[]>(() => {
    const parsed = parseTripleList(value);
    return parsed.length ? parsed : [{ a: "", b: "", c: "" }];
  });

  function update(index: number, patch: Partial<TripleRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="grid gap-3">
      <div>
        <Label>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-brand-gray">{hint}</p> : null}
      </div>
      <input type="hidden" name={name} value={serializeTripleList(rows)} />
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="rounded-xl border border-border bg-white p-4">
            <CardHeader
              title={`${itemLabel} ${index + 1}`}
              onRemove={() => setRows((prev) => prev.filter((_, i) => i !== index))}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>{aLabel}</Label>
                <Input
                  value={row.a}
                  onChange={(e) => update(index, { a: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>{bLabel}</Label>
                <Input
                  value={row.b}
                  onChange={(e) => update(index, { b: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5 md:col-span-2">
                <Label>{cLabel}</Label>
                {cMultiline ? (
                  <Textarea
                    rows={3}
                    value={row.c}
                    onChange={(e) => update(index, { c: e.target.value })}
                    className="bg-white"
                  />
                ) : (
                  <Input
                    value={row.c}
                    onChange={(e) => update(index, { c: e.target.value })}
                    className="h-11 bg-white"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddButton
        label={`Add ${itemLabel.toLowerCase()}`}
        onClick={() => setRows((prev) => [...prev, { a: "", b: "", c: "" }])}
      />
    </div>
  );
}

export function TimelineListEditor({
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
  const [rows, setRows] = useState<TimelineRow[]>(() => {
    const parsed = parseTimelineList(value);
    return parsed.length ? parsed : [{ year: "", title: "", desc: "", icon: "" }];
  });

  function update(index: number, patch: Partial<TimelineRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="grid gap-3">
      <div>
        <Label>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-brand-gray">{hint}</p> : null}
      </div>
      <input type="hidden" name={name} value={serializeTimelineList(rows)} />
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="rounded-xl border border-border bg-white p-4">
            <CardHeader
              title={`Milestone ${index + 1}`}
              onRemove={() => setRows((prev) => prev.filter((_, i) => i !== index))}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Year</Label>
                <Input
                  value={row.year}
                  onChange={(e) => update(index, { year: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <MediaUploadField
                  label="Icon"
                  kind="image"
                  value={row.icon}
                  hint="Upload a small square icon for this milestone."
                  onChange={(icon) => update(index, { icon })}
                />
              </div>
              <div className="grid gap-1.5 md:col-span-2">
                <Label>Title</Label>
                <Input
                  value={row.title}
                  onChange={(e) => update(index, { title: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={row.desc}
                  onChange={(e) => update(index, { desc: e.target.value })}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddButton
        label="Add milestone"
        onClick={() =>
          setRows((prev) => [...prev, { year: "", title: "", desc: "", icon: "" }])
        }
      />
    </div>
  );
}
