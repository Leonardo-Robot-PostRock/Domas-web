import { Flex, Text, Link } from '@chakra-ui/react';

/**
 * Funcion para renderizar texto, marcando en negrita las palabras que comienzan con # y
 * convirtiendo las coordenadas en links a google maps
 */
export default function RenderHighlightedText(text, props) {
  const segments = text.split(' ');

  return (
    <Flex gap={1}>
      {segments.map((segment, index) =>
        segment.startsWith('#') ? (
          <Text as="span" {...props} fontWeight="bold" key={index}>
            {segment}
          </Text>
        ) : segment.match(
            /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g
          ) ? (
          <Link key={index} color="teal.500" href={`https://www.google.com/maps/place/${segment}`} isExternal>
            {segment}
          </Link>
        ) : (
          <Text as="span" key={index} {...props}>
            {segment}
          </Text>
        )
      )}
    </Flex>
  );
}
