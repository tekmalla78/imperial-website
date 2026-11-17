import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormStatusPanel } from "@/components/FormStatusPanel";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { useSettings } from "@/cms/site-chrome";
import { getContactFn } from "@/cms/functions";
import { DEFAULT_CONTACT } from "@/cms/types";
import { seoMeta, str } from "@/cms/seo";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
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

export const Route = createFileRoute("/contact")({
  loader: async () => {
    const page = await getContactFn();
    return { page: { ...DEFAULT_CONTACT, ...page } };
  },
  component: ContactPage,
  head: ({ loaderData }) => ({
    meta: seoMeta(
      str(loaderData?.page.seoTitle, DEFAULT_CONTACT.seoTitle),
      str(loaderData?.page.seoDescription, DEFAULT_CONTACT.seoDescription),
    ),
  }),
});

const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(100, "Name must be 100 characters or fewer."),
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
  topic: z.enum(
    ["general", "account", "trading", "ipo-demat", "branch"],
    { required_error: "Select a topic." },
  ),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(150, "Subject must be 150 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be 2,000 characters or fewer."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const topicLabels: Record<ContactFormValues["topic"], string> = {
  general: "General inquiry",
  account: "Account opening / KYC",
  trading: "Trading support",
  "ipo-demat": "IPO / Demat",
  branch: "Branch visit",
};

const inputClassName =
  "rounded-lg border-border bg-muted/30 px-3 py-2.5 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-brand-blue/10";

function buildMailtoBody(values: ContactFormValues) {
  return [
    `Name: ${values.fullName}`,
    `Phone: ${values.phone}`,
    `Topic: ${topicLabels[values.topic]}`,
    "",
    values.message,
  ].join("\n");
}

async function submitContact(values: ContactFormValues, email: string): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error(
      "You appear to be offline. Check your connection and try again, or call us directly.",
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    `[Contact] ${values.subject}`,
  )}&body=${encodeURIComponent(buildMailtoBody(values))}`;

  if (typeof window !== "undefined") {
    window.location.href = mailto;
  }
}

function ContactForm() {
  const settings = useSettings();
  const email = settings.email;
  const phone = settings.phone;
  const phoneHref = settings.phoneHref || `tel:${settings.phone.replace(/\s/g, "")}`;
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      topic: undefined,
      subject: "",
      message: "",
    },
    mode: "onBlur",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: ContactFormValues) => {
    setFormError(null);
    setFormStatus("idle");

    try {
      await submitContact(values, email);
      setFormStatus("success");
    } catch (err) {
      setFormStatus("error");
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or contact us by phone.",
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
          Message ready to send
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your email app should open with your message addressed to{" "}
          <a
            href={`mailto:${email}`}
            className="font-medium text-brand-blue underline-offset-2 hover:underline"
          >
            {email}
          </a>
          . If it did not open, email us directly or call{" "}
          <a
            href={phoneHref}
            className="font-medium text-brand-blue underline-offset-2 hover:underline"
          >
            {phone}
          </a>
          .
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          We aim to respond within one business day (Sun–Thu).
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => {
            form.reset();
            setFormStatus("idle");
          }}
        >
          Send another message
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
              <p className="font-semibold">Could not send your message</p>
              <p className="mt-1 break-words text-muted-foreground">
                {formError}
              </p>
              <p className="mt-2 text-muted-foreground">
                Call{" "}
                <a href={phoneHref} className="font-medium text-brand-blue">
                  {phone}
                </a>{" "}
                or email{" "}
                <a
                  href={`mailto:${email}`}
                  className="font-medium text-brand-blue"
                >
                  {email}
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>
                  Topic <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={inputClassName}>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(
                      Object.entries(topicLabels) as [
                        ContactFormValues["topic"],
                        string,
                      ][]
                    ).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  placeholder="How can we help?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel>
                Message <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  maxLength={2000}
                  disabled={isSubmitting}
                  className={`min-h-[120px] resize-y ${inputClassName}`}
                  placeholder="Include any account numbers, dates, or details that help us assist you."
                />
              </FormControl>
              <FormDescription className="text-xs">
                {field.value.length}/2,000 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-xs leading-relaxed text-muted-foreground">
          For formal complaints, use our{" "}
          <Link to="/grievance" className="font-medium text-brand-blue">
            grievance form
          </Link>{" "}
          instead.
        </p>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 rounded-xl bg-gradient-to-r from-brand-green to-brand-green-dk px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(55,210,0,0.55)] hover:from-brand-green hover:to-brand-green-dk disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Send message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

function ContactPage() {
  const { page } = Route.useLoaderData();
  const settings = useSettings();
  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      lines: [settings.headOffice, "Nepal"],
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.headOffice)}`,
      external: true,
    },
    {
      icon: Phone,
      title: "Phone",
      lines: [settings.phone],
      href: settings.phoneHref || `tel:${settings.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      title: "Email",
      lines: [settings.email],
      href: `mailto:${settings.email}`,
    },
    {
      icon: Clock,
      title: "Business Hours",
      lines: [settings.hours],
    },
  ];

  return (
    <PageShell>
      <PageHero
        title={str(page.heroTitle, DEFAULT_CONTACT.heroTitle)}
        subtitle={str(page.heroSubtitle, DEFAULT_CONTACT.heroSubtitle)}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {contactInfo.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="flex gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-blue-lt text-brand-blue"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-sm font-bold text-foreground">
                      {c.title}
                    </h3>
                    {c.lines.map((line) =>
                      "href" in c && c.href && line.includes("@") ? (
                        <a
                          key={line}
                          href={`mailto:${line}`}
                          className="block break-all text-sm text-brand-blue underline-offset-2 hover:underline"
                        >
                          {line}
                        </a>
                      ) : "href" in c && c.href && c.title === "Phone" ? (
                        <a
                          key={line}
                          href={c.href}
                          className="block text-sm text-brand-blue underline-offset-2 hover:underline"
                        >
                          {line}
                        </a>
                      ) : "href" in c && c.external && c.title === "Head Office" ? (
                        <a
                          key={line}
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block break-words text-sm text-muted-foreground underline-offset-2 hover:text-brand-blue hover:underline"
                        >
                          {line}
                        </a>
                      ) : (
                        <p
                          key={line}
                          className="break-words text-sm text-muted-foreground"
                        >
                          {line}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-3 md:p-8">
            <h2 className="mb-1 font-heading text-xl font-bold text-foreground">
              Send us a message
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {str(page.formIntro, DEFAULT_CONTACT.formIntro)}
            </p>
            <ContactForm />
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-muted/40">
          <div className="flex h-64 items-center justify-center px-4 text-muted-foreground">
            <div className="max-w-sm text-center">
              <MapPin
                className="mx-auto mb-2 h-8 w-8 text-brand-blue/40"
                aria-hidden
              />
              <p className="text-sm font-medium text-foreground">
                Head Office — Anamnagar, Hanumansthan, Kathmandu
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Interactive map coming soon.{" "}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.headOffice)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-blue underline-offset-2 hover:underline"
                >
                  Open in Google Maps
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
