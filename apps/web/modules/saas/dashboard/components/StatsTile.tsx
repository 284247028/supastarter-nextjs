"use client";

import { useLocaleCurrency } from "@shared/hooks/locale-currency";
import { Badge } from "@ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { useFormatter } from "next-intl";
import { useMemo } from "react";

interface Props {
  title: string;
  value: number;
  valueFormat: "currency" | "number" | "percentage";
  context?: string;
  icon?: React.ReactNode;
  trend?: number;
}

export function StatsTile({
  title,
  value,
  context,
  icon,
  trend,
  valueFormat,
}: Props) {
  const format = useFormatter();
  const localeCurrency = useLocaleCurrency();

  const formattedValue = useMemo(() => {
    // format currency
    if (valueFormat === "currency") {
      return format.number(value, {
        style: "currency",
        currency: localeCurrency,
      });
    }
    // format percentage
    else if (valueFormat === "percentage") {
      return format.number(value, {
        style: "percent",
      });
    }
    // format default number
    else {
      return format.number(value);
    }
  }, [value, valueFormat, format]);

  const formattedTrend = useMemo(() => {
    if (!trend) {
      return null;
    }
    return `${trend >= 0 ? "+" : ""}${format.number(trend, {
      style: "percent",
    })}`;
  }, [trend, format]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <strong className="text-2xl font-bold">
            {formattedValue}
            {context && <small>{context}</small>}
          </strong>
          {trend && (
            <Badge status={trend > 0 ? "success" : "error"}>
              {formattedTrend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
