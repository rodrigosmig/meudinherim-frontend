import Script from "next/script"
import { isDevelopment } from "../../utils/helpers"

export const Analytics = () => {
	return (
		<>
			{ !isDevelopment() && (
				<>
					<Script
						strategy="lazyOnload"
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
					/>
					<Script
						strategy="lazyOnload"
						dangerouslySetInnerHTML={{
							__html: `
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());
									gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
									page_path: window.location.pathname,
									});
							`
						}}
					/>
				</>
			)}
		</>
	)
}