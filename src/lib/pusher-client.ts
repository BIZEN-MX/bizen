import PusherClient from 'pusher-js'

/**
 * The client-side instance. 
 * Use this in useEffect hooks or components.
 */
export const getPusherClient = () => {
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  })
}
