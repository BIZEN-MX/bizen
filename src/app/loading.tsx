import PageLoader from "@/components/PageLoader"

// This file is a Next.js App Router convention.
// It is automatically shown as a Suspense fallback whenever any page in the app
// is loading (navigating, fetching data, etc.). This eliminates the white "glitch"
// screen users see between navigations.
export default function Loading() {
    return <PageLoader />
}
