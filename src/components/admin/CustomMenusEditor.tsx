"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  parseCustomMenus,
  type CustomNavChild,
  type CustomNavItem,
} from "@/cms/custom-menus";

export type { CustomNavItem, CustomNavChild } from "@/cms/custom-menus";
export { parseCustomMenus } from "@/cms/custom-menus";

const emptyChild = (): CustomNavChild => ({ label: "", href: "" });
const emptyItem = (): CustomNavItem => ({ label: "", href: "", children: [] });

export function CustomMenusEditor({
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
  const [items, setItems] = useState<CustomNavItem[]>(() => parseCustomMenus(value));

  function updateItem(index: number, patch: Partial<CustomNavItem>) {
    setItems((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function updateChild(itemIndex: number, childIndex: number, patch: Partial<CustomNavChild>) {
    setItems((prev) =>
      prev.map((row, i) => {
        if (i !== itemIndex) return row;
        return {
          ...row,
          children: row.children.map((child, ci) =>
            ci === childIndex ? { ...child, ...patch } : child,
          ),
        };
      }),
    );
  }

  function removeChild(itemIndex: number, childIndex: number) {
    setItems((prev) =>
      prev.map((row, i) => {
        if (i !== itemIndex) return row;
        return { ...row, children: row.children.filter((_, ci) => ci !== childIndex) };
      }),
    );
  }

  function addChild(itemIndex: number) {
    setItems((prev) =>
      prev.map((row, i) => {
        if (i !== itemIndex) return row;
        return { ...row, children: [...row.children, emptyChild()] };
      }),
    );
  }

  return (
    <div className="grid gap-3">
      <div>
        <Label>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-brand-gray">{hint}</p> : null}
      </div>
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-white px-4 py-6 text-sm text-brand-gray">
          No custom menus yet. Add one when you need a new header item (with or without submenus).
        </p>
      ) : null}

      <div className="grid gap-4">
        {items.map((item, index) => {
          const hasChildren = item.children.length > 0;
          return (
            <div key={index} className="rounded-xl border border-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">
                  {item.label.trim() || `Custom menu ${index + 1}`}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label>Menu label</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => updateItem(index, { label: e.target.value })}
                    className="h-11 bg-white"
                    placeholder="Investors"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Link (when no submenus)</Label>
                  <Input
                    value={item.href}
                    onChange={(e) => updateItem(index, { href: e.target.value })}
                    className="h-11 bg-white"
                    placeholder="/about"
                    disabled={hasChildren}
                  />
                  <p className="text-xs text-brand-gray">
                    {hasChildren
                      ? "Disabled while submenus exist — this item opens a dropdown."
                      : "Path or full URL for a single top-level link."}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>Submenus</Label>
                  <button
                    type="button"
                    onClick={() => addChild(index)}
                    className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-sm font-medium text-brand-blue hover:bg-brand-blue-lt"
                  >
                    <Plus className="h-4 w-4" /> Add submenu
                  </button>
                </div>

                {item.children.length === 0 ? (
                  <p className="text-xs text-brand-gray">
                    No submenus — this header item will link directly.
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {item.children.map((child, childIndex) => (
                      <div
                        key={childIndex}
                        className="grid gap-2 rounded-lg border border-border bg-muted/30 p-3 md:grid-cols-[1fr_1fr_auto]"
                      >
                        <div className="grid gap-1.5">
                          <Label>Submenu label</Label>
                          <Input
                            value={child.label}
                            onChange={(e) =>
                              updateChild(index, childIndex, { label: e.target.value })
                            }
                            className="h-11 bg-white"
                            placeholder="Annual reports"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label>Page / URL</Label>
                          <Input
                            value={child.href}
                            onChange={(e) =>
                              updateChild(index, childIndex, { href: e.target.value })
                            }
                            className="h-11 bg-white"
                            placeholder="/downloads"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeChild(index, childIndex)}
                            className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="md:sr-only">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-dashed border-brand-blue/40 bg-brand-blue-lt/40 px-4 text-sm font-semibold text-brand-blue hover:border-brand-blue"
      >
        <Plus className="h-4 w-4" /> Add custom menu
      </button>
    </div>
  );
}
