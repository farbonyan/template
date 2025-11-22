import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useTheme } from "~/components/ui/theme";

const themes = [
  {
    key: "light",
    icon: SunIcon,
  },
  {
    key: "dark",
    icon: MoonIcon,
  },
  {
    key: "system",
    icon: SunMoonIcon,
  },
] as const;

/**
 * Switch between themes component
 * Options: Light, Dark and System
 */
export const SwitchThemes = () => {
  const t = useTranslations("pages.index.header.customize.theme");
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <ul className="flex flex-col items-center justify-between gap-2 sm:flex-row">
      {themes.map((theme) => {
        const isSelected = theme.key === currentTheme;
        return (
          <li key={theme.key} className="w-full">
            <Button
              variant={isSelected ? "outline" : "ghost"}
              className="w-full gap-2"
              onClick={() => setTheme(theme.key)}
            >
              <theme.icon className="size-4" />
              {t(theme.key)}
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
