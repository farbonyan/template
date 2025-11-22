import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations("pages.login");

  return {
    title: t("title"),
  };
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
