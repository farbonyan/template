import { SettingProvider } from "~/contexts/settings";
import { SystemProvider } from "~/contexts/systems";
import { Header } from "./_components/header";
import { MenuContainer } from "./_components/menu-container";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SystemProvider>
      <SettingProvider>
        <div className="flex h-screen flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-hidden bg-dashboard">
            <MenuContainer>{children}</MenuContainer>
          </div>
        </div>
      </SettingProvider>
    </SystemProvider>
  );
}
