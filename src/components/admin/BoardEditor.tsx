"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploadField } from "./MediaUploadField";
import { Plus, Trash2 } from "lucide-react";
import { parseBoardMembers, type BoardMember } from "@/cms/board";

export type { BoardMember } from "@/cms/board";
export { parseBoardMembers } from "@/cms/board";

export function BoardEditor({
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
  const [members, setMembers] = useState<BoardMember[]>(() => parseBoardMembers(value));

  function update(index: number, patch: Partial<BoardMember>) {
    setMembers((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function remove(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function add() {
    setMembers((prev) => [
      ...prev,
      { name: "", role: "", email: "", phone: "", linkedin: "", bio: "", photo: "" },
    ]);
  }

  return (
    <div className="grid gap-3">
      <div>
        <Label>{label}</Label>
        {hint ? <p className="mt-1 text-xs text-brand-gray">{hint}</p> : null}
      </div>
      <input type="hidden" name={name} value={JSON.stringify(members)} />
      <div className="grid gap-4">
        {members.map((member, index) => (
          <div key={index} className="rounded-xl border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Director {index + 1}</p>
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
                  value={member.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Role</Label>
                <Input
                  value={member.role}
                  onChange={(e) => update(index, { role: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={member.email}
                  onChange={(e) => update(index, { email: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={member.phone}
                  onChange={(e) => update(index, { phone: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5 md:col-span-2">
                <Label>LinkedIn URL</Label>
                <Input
                  type="url"
                  value={member.linkedin}
                  onChange={(e) => update(index, { linkedin: e.target.value })}
                  className="h-11 bg-white"
                />
              </div>
              <div className="grid gap-1.5 md:col-span-2">
                <Label>Bio</Label>
                <Textarea
                  rows={3}
                  value={member.bio}
                  onChange={(e) => update(index, { bio: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <MediaUploadField
                  label="Photo"
                  kind="image"
                  value={member.photo}
                  hint="Upload a square portrait when possible."
                  onChange={(photo) => update(index, { photo })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-dashed border-border px-4 text-sm font-semibold text-brand-blue hover:border-brand-blue"
      >
        <Plus className="h-4 w-4" /> Add director
      </button>
    </div>
  );
}
