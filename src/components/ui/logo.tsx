import * as React from "react";

import { cn } from "~/lib/utils";

type LogoProps = { animate?: boolean } & React.ComponentProps<"svg">;

const Logo = ({ animate, className, ...props }: LogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={cn(
        "fill-primary",
        animate &&
          "overflow-visible *:transition-all *:duration-2000 *:direction-alternate",
        className,
      )}
      viewBox="-50 -50 200 400"
      {...props}
    >
      <path
        className={cn(animate && "animate-in fade-in slide-in-from-top")}
        d="M95.29,21.55c0-11.9,9.65-21.55,21.55-21.55s21.56,9.65,21.56,21.55-9.65,21.56-21.56,21.56-21.55-9.65-21.55-21.56Z"
      />
      <path
        className={cn(animate && "animate-in fade-in slide-in-from-right")}
        d="M138.05,142.15c1.07,6.19-.34,13.04-4.27,17.84-2.17,2.74-4.96,4.45-7.89,6.21-30.42,18.35-60.89,36.75-91.3,55.09-10.47,6.27-20.84,12.74-31.25,19.1-2.57,1.67-4.4,2.03-4.33-1.74.01-11.24-.05-22.61.03-33.85v-.16c.24-10.54,6.73-17.73,15.74-22.38,3.75-2.3,5.54-3.31,13.2-7.94,22.91-13.79,69.73-41.96,75.47-45.41,11.9-8.33,31.57-4.27,34.6,13.24Z"
      />
      <path
        className={cn(animate && "animate-in fade-in slide-in-from-left")}
        d="M139.35,82.52v.16c-.24,10.54-6.73,17.73-15.73,22.38-3.76,2.3-5.55,3.31-13.2,7.94-22.92,13.79-69.73,41.96-75.47,45.41-11.9,8.33-31.57,4.27-34.61-13.24-1.06-6.19.34-13.04,4.28-17.84,2.16-2.74,4.96-4.45,7.89-6.21,30.41-18.35,60.89-36.75,91.3-55.09,10.46-6.27,20.83-12.74,31.25-19.11,2.57-1.66,4.39-2.02,4.32,1.75,0,11.24.05,22.61-.03,33.85Z"
      />
      <path
        className={cn(animate && "animate-in fade-in slide-in-from-bottom")}
        d="M43.11,265.22c0,11.91-9.65,21.56-21.56,21.56S0,277.13,0,265.22s9.65-21.55,21.55-21.55,21.56,9.65,21.56,21.55Z"
      />
    </svg>
  );
};

export { Logo, type LogoProps };
