import { Landmark } from "lucide-react";
import type { DonationAccount } from "@/types/donations";
import CopyButton from "./CopyButton";
import { accountClipboardText, accountTypeLabel, compactNumber, groupDigits } from "./shared";

interface Row {
  label: string;
  value: string;
  /** Lo que se copia (si difiere de lo que se ve) */
  copy?: string;
  mono?: boolean;
  big?: boolean;
}

// Tarjeta de una cuenta: cada dato se puede seleccionar y copiar por separado.
export default function AccountCard({ account, headingLevel = "h3" }: { account: DonationAccount; headingLevel?: "h3" | "h4" }) {
  const Heading = headingLevel;
  const rows: Row[] = [
    {
      label: "Número de cuenta",
      value: groupDigits(account.accountNumber),
      copy: compactNumber(account.accountNumber),
      mono: true,
      big: true,
    },
    { label: "Tipo de cuenta", value: accountTypeLabel(account.accountType) },
    { label: "Titular", value: account.holderName },
    ...(account.holderId ? [{ label: "Cédula o RUC", value: account.holderId, mono: true }] : []),
    ...(account.email ? [{ label: "Correo", value: account.email }] : []),
  ];

  return (
    <article
      aria-labelledby={`cuenta-${account.id}`}
      className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
    >
      <header className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-jmv-blue/10 text-jmv-blue">
          <Landmark className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <Heading id={`cuenta-${account.id}`} className="text-xl font-bold leading-tight text-slate-900">
            {account.bankName}
          </Heading>
          {account.holderRole ? (
            <p className="mt-1 text-sm font-medium text-jmv-gold-ink">{account.holderRole}</p>
          ) : null}
        </div>
      </header>

      <dl className="mt-5 divide-y divide-slate-100 rounded-2xl bg-slate-50 px-4 ring-1 ring-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600">{row.label}</dt>
              <dd
                className={
                  row.big
                    ? "mt-0.5 select-all wrap-anywhere font-mono text-2xl font-bold tracking-wide text-slate-900 sm:text-[1.7rem]"
                    : `mt-0.5 select-all wrap-anywhere text-base font-semibold text-slate-900 ${row.mono ? "font-mono tracking-wide" : ""}`
                }
              >
                {row.value}
              </dd>
            </div>
            <CopyButton
              value={row.copy ?? row.value}
              label={`Copiar ${row.label.toLowerCase()} de ${account.bankName}`}
              copiedMessage={`${row.label} copiado`}
            />
          </div>
        ))}
      </dl>

      {account.notes ? <p className="mt-4 text-sm leading-relaxed text-slate-700">{account.notes}</p> : null}

      <div className="mt-5">
        <CopyButton
          value={accountClipboardText(account)}
          label={`Copiar todos los datos de la cuenta de ${account.bankName}`}
          copiedMessage="Datos de la cuenta copiados"
          variant="full"
        >
          Copiar todos los datos
        </CopyButton>
      </div>
    </article>
  );
}
