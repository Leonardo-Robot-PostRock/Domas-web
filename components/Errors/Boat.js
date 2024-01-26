import {
   Text, Box, Image
} from "@chakra-ui/react";

const BoatError = ({title}) => {
    return (
        <>
            <Box __css={{ textAlign: '-webkit-center' }}>
                <Image src='/images/error/boat.png' alt='Broken boat' boxSize='40vh' objectFit='cover' />
            </Box>

            <Text fontSize={'24px'} color={'#5B6BFF'} fontWeight={'bold'} textAlign={'center'} width={'100%'}>{title}</Text>
            <Text fontSize={'14px'} mt={2} color={'#5B6BFF'} textAlign={'-webkit-center'} fontStyle='italic'>
                "El barco se veía bien a simple vista. Sin embargo, debido a tu fuerte miopía, <br />
                tendrías que haber llevado lentes. Mientras te sujetas a la boya que te han tirado <br />
                los guardacostas, ves cómo el agua se precipita sobre tu querido bote. <br />
                La fuga de agua comienza a rociar cada vez más alto y, finalmente, el barco <br /> 
                es tragado por las profundidades del abismo.
            </Text>


        </>
    )
}

export default BoatError;