import Image from "next/image";

import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import heroDarkImage from "/public/images/hero-dark.svg";
import heroImage from "/public/images/hero.svg";

export function Features() {
  return (
    <section className="bg-card text-card-foreground py-24">
      <div className="container">
        {/* Section header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold lg:text-5xl">
            Features your clients will love
          </h1>
          <p className="mt-3 text-lg opacity-70">
            In this section you can showcase the features of your SaaS.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16">
          {/* Feature 1 */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="bg-primary/10 rounded-2xl p-12">
              <Image
                src={heroImage}
                className="block dark:hidden"
                alt="Feature 1"
              />
              <Image
                src={heroDarkImage}
                className="hidden dark:block"
                alt="Feature 1"
              />
            </div>

            <div>
              <h3 className="text-3xl font-bold">Feature A</h3>
              <p className="mt-2 leading-normal opacity-70">
                This is a brilliant feature. And below you can see some reasons
                why. This is basically just a dummy text.
              </p>
              <Button variant="link" size="sm" className="mt-4 px-0">
                Learn more &rarr;
              </Button>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-card text-card-foreground  rounded-xl border p-4">
                  <Icon.star className="text-primary h-6 w-6 text-3xl" />
                  <strong className="mt-2 block">Benefit 1</strong>
                  <p className="opacity-70">This is a brilliant benefit.</p>
                </div>
                <div className="bg-card text-card-foreground  rounded-xl border p-4">
                  <Icon.pointer className="text-primary h-6 w-6 text-3xl" />
                  <strong className="mt-2 block">Benefit 2</strong>
                  <p className="opacity-70">This is a brilliant benefit.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="bg-primary/10 rounded-2xl p-12 lg:order-2">
              <Image
                src={heroImage}
                className="block dark:hidden"
                alt="Feature 2"
              />
              <Image
                src={heroDarkImage}
                className="hidden dark:block"
                alt="Feature 2"
              />
            </div>

            <div className="lg:order-1">
              <h3 className="text-3xl font-bold">Feature B</h3>
              <p className="mt-2 leading-normal opacity-70">
                This is a brilliant feature. And below you can see some reasons
                why. This is basically just a dummy text.
              </p>
              <Button variant="link" size="sm" className="mt-4 px-0">
                Learn more &rarr;
              </Button>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-card text-card-foreground  rounded-xl border p-4">
                  <Icon.upload className="text-primary h-6 w-6 text-3xl" />
                  <strong className="mt-2 block">Benefit 1</strong>
                  <p className="opacity-70">This is a brilliant benefit.</p>
                </div>
                <div className="bg-card text-card-foreground  rounded-xl border p-4">
                  <Icon.cloud className="text-primary h-6 w-6 text-3xl" />
                  <strong className="mt-2 block">Benefit 2</strong>
                  <p className="opacity-70">This is a brilliant benefit.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="bg-primary/10 rounded-2xl p-12 ">
              <Image
                src={heroImage}
                className="block dark:hidden"
                alt="Feature 3"
              />
              <Image
                src={heroDarkImage}
                className="hidden dark:block"
                alt="Feature 3"
              />
            </div>

            <div>
              <h3 className="text-3xl font-bold">Feature C</h3>
              <p className="mt-2 leading-normal opacity-70">
                This is a brilliant feature. And below you can see some reasons
                why. This is basically just a dummy text.
              </p>
              <Button variant="link" size="sm" className="mt-4 px-0">
                Learn more &rarr;
              </Button>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-card text-card-foreground  rounded-xl border p-4">
                  <Icon.phone className="text-primary h-6 w-6 text-3xl" />
                  <strong className="mt-2 block">Benefit 1</strong>
                  <p className="opacity-70">This is a brilliant benefit.</p>
                </div>
                <div className="bg-card text-card-foreground  rounded-xl border p-4">
                  <Icon.paperclip className="text-primary h-6 w-6 text-3xl" />
                  <strong className="mt-2 block">Benefit 2</strong>
                  <p className="opacity-70">This is a brilliant benefit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
