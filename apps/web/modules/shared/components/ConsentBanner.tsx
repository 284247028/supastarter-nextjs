"use client";

import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!Boolean(Cookies.get("consent"))) setShowBanner(true);
  }, []);

  if (!showBanner) return null;

  const handleAllow = () => {
    Cookies.set("consent", "true", { expires: 30 });
    setShowBanner(false);
  };

  const handleDecline = () => {
    Cookies.set("consent", "false", { expires: 30 });
    setShowBanner(false);
  };

  return (
    <div className="bottom fixed bottom-4 right-4 max-w-md">
      <div className="bg-card text-card-foreground flex gap-4 rounded-xl border p-6 shadow-xl">
        <Icon.cookies className="text-primary block h-4 w-4 flex-shrink-0 text-5xl" />
        <div>
          <p className="text-sm leading-normal">
            We use tracking cookies to understand how you use the product and
            help us improve it. Please accept cookies to help us improve.
          </p>
          <div className="mt-4 flex gap-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => handleDecline()}
            >
              Decline
            </Button>
            <Button className="flex-1" onClick={() => handleAllow()}>
              Allow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
