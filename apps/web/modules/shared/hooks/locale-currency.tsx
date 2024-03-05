import { appConfig } from "@config";
import { useLocale } from "next-intl";

export function useLocaleCurrency() {
  const locale = useLocale();
  const localeCurrency =
    Object.entries(appConfig.i18n.localeCurrencies).find(
      ([key, value]) => key === locale,
    )?.[1] || "USD";

  return localeCurrency;
}
