import { useTabOpener } from "~/contexts/tab-manager";
import { api } from "~/trpc/react";

export type UseUserDropdownProps = { excepts?: string[] };

export const useUserDropdown = (props?: UseUserDropdownProps) => {
  const openTab = useTabOpener();
  const getUserDropdownQuery = api.user.dropdown.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  return {
    data: getUserDropdownQuery.data
      ? props?.excepts
        ? getUserDropdownQuery.data.filter(
            (p) => !props.excepts!.includes(p.id),
          )
        : getUserDropdownQuery.data
      : [],
    onCreate: () => {
      return new Promise<string | undefined>((resolve) => {
        void openTab("users.single", {}, resolve);
      });
    },
  };
};
