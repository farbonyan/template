"use client";

import * as React from "react";
import ErrorPage from "next/error";

export default function Error() {
  return (
    <html lang="en">
      <body>
        <ErrorPage statusCode={500} />
      </body>
    </html>
  );
}
