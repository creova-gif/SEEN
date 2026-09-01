import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Users, Receipt, XCircle, RefreshCcw } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserSubscriptions,
  getUserPurchases,
  getTransactionsForUser,
  cancelSubscription,
} from "../data/monetizationService";
import { formatCents } from "../data/monetizationTypes";

interface SubscriptionManagementScreenProps {
  onClose: () => void;
}

export function SubscriptionManagementScreen({ onClose }: SubscriptionManagementScreenProps) {
  const { state } = useStoryState();
  const { state: authState } = useAuth();
  const lang = state.language;
  const t = (en: string, fr: string, es: string) => (lang === "en" ? en : lang === "fr" ? fr : es);
  const [refreshKey, setRefreshKey] = useState(0);

  const userId = authState.user?.id ?? "";
  const subscriptions = useMemo(() => getUserSubscriptions(userId), [userId, refreshKey]);
  const purchases = useMemo(() => getUserPurchases(userId), [userId, refreshKey]);
  const transactions = useMemo(() => getTransactionsForUser(userId), [userId, refreshKey]);

  const activeSubscriptions = subscriptions.filter(s => s.status === "active");
  const pastSubscriptions = subscriptions.filter(s => s.status !== "active");

  const handleCancel = (id: string) => {
    cancelSubscription(id);
    setRefreshKey(k => k + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-y-auto"
    >
      <div className="min-h-full max-w-[428px] mx-auto pb-24">
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/80 border-b border-white/5">
          <div className="flex items-center justify-between p-5 pt-8">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label={t("Back", "Retour", "Atrás")}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base tracking-tight text-white">
              {t("Subscriptions & Billing", "Abonnements et Facturation", "Suscripciones y Facturación")}
            </h2>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Active subscriptions */}
          <section>
            <h3 className="text-sm tracking-wider uppercase text-white/40 mb-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              {t("Active Subscriptions", "Abonnements Actifs", "Suscripciones Activas")}
            </h3>
            {activeSubscriptions.length === 0 ? (
              <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-white/40">
                  {t("No active subscriptions yet.", "Aucun abonnement actif.", "Aún no tienes suscripciones activas.")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSubscriptions.map(sub => (
                  <div key={sub.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm text-white">{sub.creatorName}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
                        {t("Active", "Actif", "Activo")}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mb-3">
                      {sub.tierName} · {formatCents(sub.priceMonthly)}/{t("mo", "mois", "mes")}
                    </p>
                    <p className="text-xs text-white/30 mb-3">
                      {t("Renews", "Renouvelle", "Renueva")} {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleCancel(sub.id)}
                      className="w-full py-2 rounded-lg bg-red-500/10 border border-red-400/20 text-red-300 text-xs hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {t("Cancel subscription", "Annuler l'abonnement", "Cancelar suscripción")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Past subscriptions */}
          {pastSubscriptions.length > 0 && (
            <section>
              <h3 className="text-sm tracking-wider uppercase text-white/40 mb-4">
                {t("Past Subscriptions", "Abonnements Passés", "Suscripciones Anteriores")}
              </h3>
              <div className="space-y-2">
                {pastSubscriptions.map(sub => (
                  <div key={sub.id} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-sm text-white/50">{sub.creatorName}</span>
                    <span className="text-xs text-white/30">{t("Canceled", "Annulé", "Cancelado")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Purchase history */}
          <section>
            <h3 className="text-sm tracking-wider uppercase text-white/40 mb-4 flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5" />
              {t("One-time Purchases", "Achats Uniques", "Compras Únicas")}
            </h3>
            {purchases.length === 0 ? (
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-white/40">{t("No purchases yet.", "Aucun achat.", "Sin compras.")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {purchases.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm text-white">{p.contentTitle}</p>
                      <p className="text-xs text-white/40">{new Date(p.purchasedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm text-white/70">{formatCents(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Billing history */}
          <section>
            <h3 className="text-sm tracking-wider uppercase text-white/40 mb-4 flex items-center gap-2">
              <RefreshCcw className="w-3.5 h-3.5" />
              {t("Billing History", "Historique de Facturation", "Historial de Facturación")}
            </h3>
            {transactions.length === 0 ? (
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm text-white/40">{t("No charges yet.", "Aucun débit.", "Sin cargos.")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm text-white">
                        {txn.creatorName ?? t("CREOVA", "CREOVA", "CREOVA")} {txn.last4 && `•••• ${txn.last4}`}
                      </p>
                      <p className="text-xs text-white/40">{new Date(txn.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm text-white/70">{formatCents(txn.amountGross)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
}
