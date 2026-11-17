import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FieldDef } from "@/cms/collections";
import { MediaUploadField } from "./MediaUploadField";
import { RichTextEditor } from "./RichTextEditor";
import { BoardEditor } from "./BoardEditor";
import { PaymentMethodsEditor } from "./PaymentMethodsEditor";
import { CustomMenusEditor } from "./CustomMenusEditor";
import {
  LinesListEditor,
  PairsListEditor,
  TimelineListEditor,
  TriplesListEditor,
} from "./ListEditor";

export function AdminField({
  field,
  value,
}: {
  field: FieldDef;
  value: unknown;
}) {
  const id = `field-${field.name}`;
  const current = value == null ? "" : String(value);
  const hintId = field.hint ? `${id}-hint` : undefined;

  if (field.type === "toggle") {
    return (
      <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border bg-white px-3 py-2">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={current !== "false"}
          className="h-4 w-4 accent-[oklch(0.42_0.14_160)]"
        />
        <span>
          <span className="block text-sm font-medium">{field.label}</span>
          {field.hint ? <span className="text-xs text-brand-gray">{field.hint}</span> : null}
        </span>
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <MediaUploadField
        name={field.name}
        label={field.label}
        value={current}
        kind="image"
        hint={field.hint}
        required={field.required}
      />
    );
  }

  if (field.type === "file") {
    return (
      <MediaUploadField
        name={field.name}
        label={field.label}
        value={current}
        kind="file"
        hint={field.hint}
        required={field.required}
      />
    );
  }

  if (field.type === "richtext") {
    return (
      <RichTextEditor
        name={field.name}
        label={field.label}
        value={current}
        hint={field.hint}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "board") {
    return (
      <BoardEditor name={field.name} label={field.label} value={value} hint={field.hint} />
    );
  }

  if (field.type === "payment-methods") {
    return (
      <PaymentMethodsEditor name={field.name} label={field.label} value={value} hint={field.hint} />
    );
  }

  if (field.type === "custom-menus") {
    return (
      <CustomMenusEditor name={field.name} label={field.label} value={value} hint={field.hint} />
    );
  }

  if (field.type === "lines") {
    return (
      <LinesListEditor
        name={field.name}
        label={field.label}
        value={value}
        hint={field.hint}
        itemLabel={field.itemLabel ?? "Item"}
      />
    );
  }

  if (field.type === "pairs") {
    return (
      <PairsListEditor
        name={field.name}
        label={field.label}
        value={value}
        hint={field.hint}
        itemLabel={field.itemLabel ?? "Item"}
        titleLabel={field.titleLabel ?? "Title"}
        descLabel={field.descLabel ?? "Description"}
        descMultiline={field.descMultiline ?? true}
      />
    );
  }

  if (field.type === "triples") {
    return (
      <TriplesListEditor
        name={field.name}
        label={field.label}
        value={value}
        hint={field.hint}
        itemLabel={field.itemLabel ?? "Item"}
        aLabel={field.aLabel ?? "Field 1"}
        bLabel={field.bLabel ?? "Field 2"}
        cLabel={field.cLabel ?? "Field 3"}
        cMultiline={field.cMultiline ?? false}
      />
    );
  }

  if (field.type === "timeline") {
    return (
      <TimelineListEditor
        name={field.name}
        label={field.label}
        value={value}
        hint={field.hint}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="grid gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea
          id={id}
          name={field.name}
          required={field.required}
          rows={field.rows ?? 6}
          defaultValue={current}
          placeholder={field.placeholder}
          aria-describedby={hintId}
          className="min-h-28 bg-white"
        />
        {field.hint ? (
          <p id={hintId} className="text-xs text-brand-gray">
            {field.hint}
          </p>
        ) : null}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="grid gap-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <select
          id={id}
          name={field.name}
          defaultValue={current}
          required={field.required}
          className="h-11 rounded-md border border-input bg-white px-3 text-sm"
        >
          <option value="">Choose…</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        name={field.name}
        type={field.type === "date" ? "date" : field.type}
        required={field.required}
        defaultValue={current}
        placeholder={field.placeholder}
        aria-describedby={hintId}
        className="h-11 bg-white"
      />
      {field.hint ? (
        <p id={hintId} className="text-xs text-brand-gray">
          {field.hint}
        </p>
      ) : null}
    </div>
  );
}

export function SavedBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="mb-4 rounded-lg border border-brand-green/30 bg-brand-green-lt px-3 py-2 text-sm font-medium text-brand-green-dk">
      Saved. The public site will show this on the next page load.
    </p>
  );
}
