import { isDevelopment } from './helpers';
export const pageview = (url:URL) => {
  if (isDevelopment()) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  })
}
  
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (isDevelopment()) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};
