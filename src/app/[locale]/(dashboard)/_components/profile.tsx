"use client";

import type { Session } from "next-auth";
import * as React from "react";
import { BotIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

export type ProfileProps = {
  session: Session;
  className?: string;
};

export const Profile = ({ session, className }: ProfileProps) => {
  return (
    <div className={cn("flex w-full items-center gap-4", className)}>
      <Avatar className="size-12 shrink-0 border">
        <AvatarImage src={session.user.image ?? "/img/SABI.jpg"} alt="avatar" />
        <AvatarFallback>
          <BotIcon className="size-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-start">
        <p className="text-sm font-light">{session.user.position}</p>
        <p>{session.user.name}</p>
      </div>
    </div>
  );
};
