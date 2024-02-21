import { TooltipProps } from '@/types/tooltip/tooltipContent';

export const TooltipFormatter = ({ content }: TooltipProps) => {
  const comma = ', ';
  return (
    <>
      {content.map((item, index) => (
        <span key={index}>
          {typeof item === 'string' ? item : item.name}
          {/* While index is less than content.length -1 then <br/> */}
          {index < content.length - 1 && (
            <>
              {comma}
              <br />
            </>
          )}
        </span>
      ))}
    </>
  );
};
