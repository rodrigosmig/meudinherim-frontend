import { AlertCircle } from "lucide-react";

import ResponsivePageTitle from "./header/responsive-page-title";
import Heading from "./primitives/heading";
import Text from "./primitives/text";

interface ErrorPageProps {
  title: string;
  message: string;
}

export function ErrorPage({ title, message }: ErrorPageProps) {
  return (
    <>
      <ResponsivePageTitle
        title={""}
      />

      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-12 h-12 text-negative" />
        <Heading variant="heading3">{title}</Heading>
        <Text variant="paragraph-medium" className="text-gray-400">
          {message}
        </Text>
      </div>
    </>
  );
}
