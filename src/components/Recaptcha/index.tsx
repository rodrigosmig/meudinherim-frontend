import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { isDevelopment } from "../../utils/helpers";

interface RecaptchaProps extends BoxProps {
  onCheck: (token: string) => void;
	onExpired: () => void
}

export const Recaptcha = ({ onCheck, onExpired, ...rest }: RecaptchaProps) => {
	const { colorMode } = useColorMode();

	return (
		<>
			{ !isDevelopment() && (
				<Box 
					marginTop={6}
					{...rest}
				>
					<ReCAPTCHA
						sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY}
						theme={colorMode}
						hl="pt-BR"
						onChange={onCheck}
						onExpired={onExpired}
					/>
				</Box>
			)}			
		</>
	)
}