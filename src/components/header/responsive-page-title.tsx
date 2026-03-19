import { cn } from "@/helpers/string-helper";

import Heading from "../primitives/heading";
import Loading from "../primitives/loading";
import Text from "../primitives/text";
import { Header } from "./header";

type ResponsivePageTitleProps = {
  title: string;
  isLoading?: boolean;
  metricLabel?: string;
  metricValue?: string;
  metricValueClassName?: string;
  className?: string;
};

export default function ResponsivePageTitle({
  title,
  isLoading,
  metricLabel,
  metricValue,
  metricValueClassName,
  className,
}: ResponsivePageTitleProps) {
  const hasMetric = metricLabel && metricValue !== undefined;

  return (
    <>
      <Header.Title>
        <div className={cn("flex gap-2 items-center", className)}>
          <Heading variant="heading2">{title}</Heading>
          {isLoading && <Loading />}
        </div>

        {hasMetric && (
          <div className="flex flex-col items-end mr-4">
            <Text variant="paragraph-small">{metricLabel}</Text>
            <Heading variant="heading4" className={metricValueClassName}>{metricValue}</Heading>
          </div>
        )}
      </Header.Title>

      <div className="flex justify-between md:hidden mb-2 px-1">
        <Heading variant="heading2">{title}</Heading>

        {hasMetric && (
          <div className="flex flex-col items-end">
            <Text variant="caption">{metricLabel}</Text>
            <Text variant="paragraph-medium" className={cn("font-bold", metricValueClassName)}>
              {metricValue}
            </Text>
          </div>
        )}
      </div>
    </>
  );
}