import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { getPaymentBankingFn } from "@/cms/functions";
import { PAYMENT_BANKING_FIELDS } from "@/cms/singleton-fields";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { z } from "zod";

export const Route = createFileRoute("/admin/payment-banking")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: () => getPaymentBankingFn(),
  component: PaymentBankingEditor,
  head: () => ({
    meta: [{ title: "Payment & Banking — Imperial Admin" }],
  }),
});

function PaymentBankingEditor() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const data = Route.useLoaderData();
  const { saved } = Route.useSearch();

  return (
    <AdminShell
      title="Payment & Banking"
      subtitle="Homepage payment methods and popup content — steps, account details, or QR codes per method."
      user={adminUser ?? ""}
      actions={
        <a href="/#payment-banking" className="text-sm font-medium text-brand-blue hover:underline">
          View on homepage
        </a>
      }
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection="payment-banking"
        id="payment-banking"
        fields={PAYMENT_BANKING_FIELDS}
        initial={data}
        redirectTo="/admin/payment-banking"
        publicPath="/"
      />
    </AdminShell>
  );
}
