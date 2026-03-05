import { Profile, License } from "@prisma/client";

/**
 * Validates whether the user has access to premium content.
 * B2C uses Stripe subscription, B2B uses School License.
 */
export function hasPremiumAccess(profile: Profile | null, license: License | null = null): boolean {
    if (!profile) return false;

    // 1. Check B2C (Stripe Subscription)
    if (profile.subscriptionStatus === 'active') {
        // If we track expiration
        if (profile.subscriptionEnds) {
            const now = new Date();
            if (new Date(profile.subscriptionEnds) > now) {
                return true;
            }
        } else {
            // If we don't have expiration yet, we assume it's active
            return true;
        }
    }

    // 2. Check B2B (School License)
    if (license && license.status === 'active') {
        const now = new Date();
        // Validate if the license is within the valid timeframe
        if (now >= new Date(license.startDate) && now <= new Date(license.endDate)) {
            return true;
        }
    }

    return false;
}
