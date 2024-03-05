"use client";

import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { useEffect, useState } from "react";

const BANNER_HIDDEN_STORAGE_KEY = "banner-hidden";

export function Banner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(BANNER_HIDDEN_STORAGE_KEY)) {
      setShowBanner(true);
    }
  }, []);

  function hideBanner() {
    localStorage.setItem(BANNER_HIDDEN_STORAGE_KEY, "true");
    setShowBanner(false);
  }

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="bg-primary/10 text-foreground relative inset-0 bottom-auto px-8 py-3 text-center text-sm data-[state='open']:block data-[state='closed']:hidden"
      data-test="banner"
    >
      <div>
        <strong>New:</strong> In this banner you can show your awesome new
        feature
      </div>
      <Button
        variant="link"
        onClick={hideBanner}
        className="absolute right-1 top-1"
      >
        <Icon.close />
      </Button>
    </div>
  );
}
