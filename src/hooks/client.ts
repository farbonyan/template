import * as React from "react";

/**
 * Check if it is in client
 *
 * @returns True if it is on client
 */
export const useClient = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
