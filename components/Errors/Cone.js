import {
    Text, Box, Image
 } from "@chakra-ui/react";
 
 const ConeError = ({title}) => {
     return (
         <>
             <Box __css={{ textAlign: '-webkit-center' }}>
                 <Image src='/images/error/cone.png' alt='Broken boat' boxSize='50vh' objectFit='cover' />
             </Box>
 
             <Text fontSize={'24px'} color={'#D53C2B'} fontWeight={'bold'} textAlign={'center'} width={'100%'}>¡Algo salió mal!</Text>
             <Text fontSize={'18px'} color={'#D53C2B'} textAlign={'-webkit-center'} mb={'2vh'}>
                Pero no te preocupes, el equipo de desarrollo está trabajando para solucionarlo lo más rápido posible
             </Text>
 
 
         </>
     )
 }
 
 export default ConeError;