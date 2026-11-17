import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormStatusPanel } from "@/components/FormStatusPanel";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGrievanceFn } from "@/cms/functions";
import { DEFAULT_GRIEVANCE } from "@/cms/types";
import { seoMeta, str } from "@/cms/seo";
import { splitTriples } from "@/cms/collections";
import { CmsHtml } from "@/components/CmsHtml";

export const Route = createFileRoute("/grievance")({
  loader: async () => {
    const page = await getGrievanceFn();
    return { page: { ...DEFAULT_GRIEVANCE, ...page } };
  },
  component: GrievancePage,
  head: ({ loaderData }) => ({
    meta: seoMeta(
      str(loaderData?.page.seoTitle, DEFAULT_GRIEVANCE.seoTitle),
      str(loaderData?.page.seoDescription, DEFAULT_GRIEVANCE.seoDescription),
    ),
  }),
});

const grievanceCategories = [
  "trading",
  "account-kyc",
  "payment-settlement",
  "demat-dp",
  "ipo-fpo",
  "staff",
  "other",
] as const;

const categoryLabels: Record<(typeof grievanceCategories)[number], string> = {
  trading: "Trading / Order Issue",
  "account-kyc": "Account / KYC",
  "payment-settlement": "Payment / Settlement",
  "demat-dp": "Demat / DP Services",
  "ipo-fpo": "IPO / FPO",
  staff: "Staff Behaviour",
  other: "Other",
};

const grievanceSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(100, "Name must be 100 characters or fewer."),
  clientId: z
    .string()
    .trim()
    .max(50, "Client / DP ID must be 50 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address.")
    .max(255, "Email must be 255 characters or fewer."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(20, "Phone must be 20 characters or fewer.")
    .regex(/^[0-9+\s()-]+$/, "Use digits, spaces, +, -, and parentheses only."),
  category: z.enum(grievanceCategories, {
    required_error: "Select a complaint category.",
  }),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(150, "Subject must be 150 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters so we can investigate.")
    .max(2000, "Description must be 2,000 characters or fewer."),
});

type GrievanceFormValues = z.infer<typeof grievanceSchema>;

const inputClassName =
  "rounded-lg border-border bg-muted/30 px-3 py-2.5 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/10";

function buildMailtoBody(values: GrievanceFormValues) {
  return [
    `Name: ${values.fullName}`,
    values.clientId ? `Client / DP ID: ${values.clientId}` : "Client / DP ID: Not provided",
    `Phone: ${values.phone}`,
    `Category: ${categoryLabels[values.category]}`,
    "",
    values.description,
  ].join("\n");
}

async function submitGrievance(values: GrievanceFormValues, officerEmail: string): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error(
      "You appear to be offline. Check your connection and try again, or call our grievance line directly.",
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  const mailto = `mailto:${officerEmail}?subject=${encodeURIComponent(
    `[Grievance] ${values.subject}`,
  )}&body=${encodeURIComponent(buildMailtoBody(values))}`;

  if (typeof window !== "undefined") {
    window.location.href = mailto;
  }
}

function GrievanceForm({
  officerEmail,
  officerPhone,
  officerPhoneHref,
}: {
  officerEmail: string;
  officerPhone: string;
  officerPhoneHref: string;
}) {
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<GrievanceFormValues>({
    resolver: zodResolver(grievanceSchema),
    defaultValues: {
      fullName: "",
      clientId: "",
      email: "",
      phone: "",
      category: undefined,
      subject: "",
      description: "",
    },
    mode: "onBlur",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: GrievanceFormValues) => {
    setFormError(null);
    setFormStatus("idle");

    try {
      await submitGrievance(values, officerEmail);
      setFormStatus("success");
    } catch (err) {
      setFormStatus("error");
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or contact our grievance officer directly.",
      );
    }
  };

  if (formStatus === "success") {
    return (
      <FormStatusPanel
        variant="success"
        className="rounded-xl border border-brand-green/30 bg-brand-green-lt/50 p-6 text-center"
      >
        <CheckCircle2
          className="mx-auto mb-2 h-10 w-10 text-brand-green-dk"
          aria-hidden
        />
        <h3 className="font-heading text-lg font-bold text-foreground">
          Complaint ready to send
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your email app should open with your grievance addressed to{" "}
          <a
            href={`mailto:${officerEmail}`}
            className="break-all font-medium text-brand-blue underline-offset-2 hover:underline"
          >
            {officerEmail}
          </a>
          . If it did not open, email us directly or call{" "}
          <a
            href={officerPhoneHref}
            className="font-medium text-brand-blue underline-offset-2 hover:underline"
          >
            {officerPhone}
          </a>
          .
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          We aim to acknowledge your complaint within 2 working days and
          respond within 15 working days, in line with SEBON guidelines.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5 min-h-11"
          onClick={() => {
            form.reset();
            setFormStatus("idle");
          }}
        >
          Submit another complaint
        </Button>
      </FormStatusPanel>
    );
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-busy={isSubmitting}
      >
        {formStatus === "error" && formError && (
          <FormStatusPanel
            variant="error"
            className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Could not prepare your complaint</p>
              <p className="mt-1 break-words text-muted-foreground">
                {formError}
              </p>
              <p className="mt-2 text-muted-foreground">
                Call{" "}
                <a href={officerPhoneHref} className="font-medium text-brand-blue">
                  {officerPhone}
                </a>{" "}
                or email{" "}
                <a
                  href={`mailto:${officerEmail}`}
                  className="break-all font-medium text-brand-blue"
                >
                  {officerEmail}
                </a>
                .
              </p>
            </div>
          </FormStatusPanel>
        )}

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>
                        Full name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoComplete="name"
                          maxLength={100}
                          disabled={isSubmitting}
                          className={inputClassName}
                          placeholder="Your full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>Client / DP ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoComplete="off"
                          maxLength={50}
                          disabled={isSubmitting}
                          className={inputClassName}
                          placeholder="e.g. 13013100XXXXXXXXXX"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Optional — helps us locate your account faster.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          maxLength={255}
                          disabled={isSubmitting}
                          className={inputClassName}
                          placeholder="you@email.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>
                        Phone <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          maxLength={20}
                          disabled={isSubmitting}
                          className={inputClassName}
                          placeholder="+977 98XXXXXXXX"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>
                      Category <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={inputClassName}>
                          <SelectValue placeholder="Select complaint category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {grievanceCategories.map((value) => (
                          <SelectItem key={value} value={value}>
                            {categoryLabels[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>
                      Subject <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={150}
                        disabled={isSubmitting}
                        className={inputClassName}
                        placeholder="Short summary of the issue"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel>
                      Describe your grievance{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        maxLength={2000}
                        disabled={isSubmitting}
                        className={`min-h-[144px] resize-y ${inputClassName}`}
                        placeholder="Include dates, amounts, transaction IDs, and any context that helps us investigate."
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {field.value.length}/2,000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div
                className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground"
                role="note"
              >
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dk"
                  aria-hidden
                />
                Your information is treated confidentially and used only to
                resolve your complaint.
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-h-11 rounded-xl bg-gradient-to-r from-brand-blue to-brand-blue-dk px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:from-brand-blue hover:to-brand-blue-dk disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden />
                    Submit grievance
                  </>
                )}
              </Button>
            </form>
          </Form>
  );
}

function GrievancePage() {
  const { page } = Route.useLoaderData();
  const officerEmail = str(page.officerEmail, DEFAULT_GRIEVANCE.officerEmail);
  const officerPhone = str(page.officerPhone, DEFAULT_GRIEVANCE.officerPhone);
  const officerPhoneHref = str(page.officerPhoneHref, DEFAULT_GRIEVANCE.officerPhoneHref);
  const officerPhoto = str(page.officerPhoto, DEFAULT_GRIEVANCE.officerPhoto);
  const steps = splitTriples(page.steps).map((row) => ({
    n: row.a,
    t: row.b,
    d: row.c,
  }));
  const officer = [
    {
      icon: User,
      label: "Grievance Officer",
      value: str(page.officerName, DEFAULT_GRIEVANCE.officerName),
    },
    {
      icon: Phone,
      label: "Direct Line",
      value: officerPhone,
      href: officerPhoneHref,
    },
    {
      icon: Mail,
      label: "Email",
      value: officerEmail,
      href: `mailto:${officerEmail}`,
    },
    {
      icon: MapPin,
      label: "Office",
      value: str(page.officerAddress, DEFAULT_GRIEVANCE.officerAddress),
      href: `https://maps.google.com/?q=${encodeURIComponent(str(page.officerAddress, DEFAULT_GRIEVANCE.officerAddress))}`,
      external: true,
    },
    {
      icon: Clock,
      label: "Hours",
      value: str(page.officerHours, DEFAULT_GRIEVANCE.officerHours),
    },
  ];

  return (
    <PageShell>
      <PageHero
        eyebrow={str(page.heroEyebrow, DEFAULT_GRIEVANCE.heroEyebrow)}
        title={str(page.heroTitle, DEFAULT_GRIEVANCE.heroTitle)}
        subtitle={str(page.heroSubtitle, DEFAULT_GRIEVANCE.heroSubtitle)}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Grievance" }]}
      />

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-brand-blue-lt/40">
            <img
              src={officerPhoto}
              alt={`${str(page.officerName, DEFAULT_GRIEVANCE.officerName)} — Grievance Officer`}
              width={500}
              height={500}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-green-lt px-3 py-1 text-xs font-semibold text-brand-green-dk">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {str(page.sectionBadge, DEFAULT_GRIEVANCE.sectionBadge)}
            </span>
            <h2 className="mt-3 text-balance font-heading text-2xl font-extrabold text-foreground md:text-3xl">
              {str(page.sectionTitle, DEFAULT_GRIEVANCE.sectionTitle)}
            </h2>
            <div className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              <CmsHtml
                value={page.sectionBody}
                className="prose prose-sm max-w-none text-muted-foreground"
              />
            </div>

            <dl className="mt-6 space-y-3 rounded-2xl border border-border bg-white p-5 shadow-sm">
              {officer.map((o) => {
                const Icon = o.icon;
                return (
                  <div key={o.label} className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-lt text-brand-blue"
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {o.label}
                      </dt>
                      <dd className="text-sm font-medium text-foreground">
                        {"href" in o && o.href ? (
                          <a
                            href={o.href}
                            {...("external" in o && o.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            className={
                              o.label === "Office"
                                ? "break-words text-muted-foreground underline-offset-2 hover:text-brand-blue hover:underline"
                                : "break-all text-brand-blue underline-offset-2 hover:underline"
                            }
                          >
                            {o.value}
                          </a>
                        ) : (
                          <span className="break-words">{o.value}</span>
                        )}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full bg-brand-blue-lt px-3 py-1 text-xs font-semibold text-brand-blue">
              Process
            </span>
            <h2 className="mt-2 text-balance font-heading text-2xl font-extrabold text-foreground">
              How Your Complaint Is Handled
            </h2>
          </div>
          <ol className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li
                key={s.n}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <div
                  className="font-heading text-2xl font-extrabold text-brand-green-dk"
                  aria-hidden
                >
                  {s.n}
                </div>
                <h3 className="mt-2 text-sm font-bold text-foreground">{s.t}</h3>
                <p className="mt-1 text-pretty text-xs text-muted-foreground">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-lt text-brand-green-dk"
              aria-hidden
            >
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {str(page.formTitle, DEFAULT_GRIEVANCE.formTitle)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {str(page.formIntro, DEFAULT_GRIEVANCE.formIntro)}
              </p>
            </div>
          </div>

          <GrievanceForm
            officerEmail={officerEmail}
            officerPhone={officerPhone}
            officerPhoneHref={officerPhoneHref}
          />
        </div>
      </section>
    </PageShell>
  );
}
