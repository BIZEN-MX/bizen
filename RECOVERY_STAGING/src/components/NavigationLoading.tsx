"use client";

interface NavigationLoadingProps {
  isLoading: boolean;
}

import PageLoader from "./PageLoader"

export default function NavigationLoading({ isLoading }: NavigationLoadingProps) {
  if (!isLoading) return null;
  return <PageLoader />;
}


