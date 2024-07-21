"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface CardWrapperProps {
  cardDescription?: string;
  className?: string;
  cardTitle?: string;
  footerJsx?: ReactNode;
  children: ReactNode;
}

export function CardWrapper({
  cardDescription,
  className,
  cardTitle,
  footerJsx,
  children,
}: CardWrapperProps) {
  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>

          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>

        <CardContent>{children}</CardContent>

        <CardFooter>{footerJsx}</CardFooter>
      </Card>
    </>
  );
}
