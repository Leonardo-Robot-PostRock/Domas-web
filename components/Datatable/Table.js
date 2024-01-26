import { Box, Button, Container, Flex, Input, InputGroup, InputLeftElement, Progress, Select, Text } from "@chakra-ui/react"
import { ImFilePdf } from 'react-icons/im';
import { SiMicrosoftexcel } from 'react-icons/si';
import { BiSearch } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import DataTable from 'react-data-table-component';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import OptionsMenu from "./OptionsMenu";


const TableContainer = ({ children, containerWidth, }) => {
    return (
        <Container mb={'2vh'} p={5} rounded={'md'} maxW={containerWidth} bg={'white'} boxShadow={'-1px 2px 29px -3px rgb(0 0 0 / 10%)'}>
            {children}
        </Container>
    )
}

const TableContainerSimple = ({ children, containerWidth, }) => {
    return (
        <Container p={5} rounded={'md'} maxW={containerWidth} bg={'white'} >
            {children}
        </Container>
    )
}

const TableHeader = ({ isExportable, title, customButton }) => {
    const options = [
        // {
        //     label: 'Exportar PDF',
        //     action: () => console.log('exportando como pdf...'),
        //     rightIcon: <ImFilePdf color="#3B457F" />
        // },
        {
            label: 'Exportar Excel',
            action: () => alert('exportando como excel...'),
            rightIcon: <SiMicrosoftexcel color="#3B457F" />
        }
    ]

    return (
        <Flex mb={4} flexDir={'row'} flexWrap={'wrap'} justifyContent={'space-between'} alignItems={'center'}>
            <Text fontSize={'2em'} fontWeight={'700'} color={'#319DA0'} textTransform={'uppercase'}>{title}</Text>
            <Flex gap={5} my={5}>
                {customButton}
                {
                    //TODO descomentar cuando se pida poder exportar la tabla
                }
                {/* {isExportable && <OptionsMenu items={options} />} */}
            </Flex>
        </Flex>
    )
}

const TableFilterItemSelected = ({ count, label }) => {
    return (
        <Flex bg={'brand.300'} rounded={'md'}>
            <Box bg={'brand.900'} p={1} roundedLeft="md" color={'white'}>
                {count}
            </Box>
            <Text ml={2} mr={2} alignSelf={'center'}>
                {label}
            </Text>
            <Flex bg={'red.500'} p={1} roundedRight="md" color={'white'} alignItems={'center'}
                cursor={'pointer'} onClick={() => alert('Eliminar elemento')}>
                <FaTimes />
            </Flex>
        </Flex>
    )
}

const TableFilterSelected = ({ items }) => {
    return (
        <Flex mt={4} p={2} gap={4} flexWrap={'wrap'}>

            {
                items && items.map((item, index) => <TableFilterItemSelected key={index} count={item.count} label={item.label} />)
            }

        </Flex>
    )
}

const TableFilter = ({ handleOnChange }) => {

    return (
        <>
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                >
                    <BiSearch color='#535C8F' />
                </InputLeftElement>

                <Input
                    autoFocus={false}
                    type='text'
                    placeholder='Buscar'
                    rounded={'3xl'}
                    border={0}
                    bg={'#F4F7FE'}
                    color={'#00425A'}
                    // _placeholder={{ color: 'brand.500' }}
                    _focus={{ border: '0.2px solid #319DA0' }}
                    onChange={(e) => handleOnChange(e.target.value)}
                />
            </InputGroup>

            <TableFilterSelected />
        </>
    )
}


const Table = ({ columns, data, title, isLoading, containerWidth, tableHeight = '60vh', customButtonHeader, error, selectable = false, handleRowSelected, clearSelectedRows = false, container = 'shadow' }) => {

    const [dataFiltered, setDataFiltered] = useState();

    const customStyles = {
        rows: {
            style: {
                padding: '1vh',
            },
        },
        headCells: {
            style: {
                justifyContent: 'center',
                color: '#989EBF',
                fontSize: '14px',
                fontWeight: 'normal',
            },
        },
        cells: {
            style: {
                justifyContent: 'center',
                color: '#2B3674',
                fontSize: '14px',
                fontWeight: 600,
            },
        },
        table: {
            style: {
                height: tableHeight
            }
        },
        pagination: {
            style: {
                color: '#4B6F95'
            },
            pageButtonsStyle: {
                backgroundColor: '#F4F7FE',
                '&:focus': {
                    backgroundColor: '#E6E9EF',
                },
                '&:hover:not(:disabled)': {
                    backgroundColor: '#E6E9EF',
                },
            }
        }
    };

    function handleFilter (value) {

        const filtered = value ? data.filter(item => {
            const valuesAsString = Object.values(item).toString().toUpperCase();

            return valuesAsString.includes(value.toUpperCase())
        }) : data;

        setDataFiltered(filtered);

    }

    if (container == 'shadow'){
        return (
            <TableContainer containerWidth={containerWidth} >
                <TableHeader isExportable={data && !error ? data.length > 0 : false} title={title} customButton={customButtonHeader} />
    
                {
                    !error && <>
                        {data && <TableFilter handleOnChange={(value) => handleFilter(value)} />}
                        <DataTable
                            columns={columns}
                            data={dataFiltered ? dataFiltered : data}
                            customStyles={customStyles}
                            fixedHeader={true}
                            noDataComponent={<Text color={'gray.400'}>No hay registros para mostrar</Text>}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Filas por página',
                                rangeSeparatorText: 'de',
                                selectAllRowsItem: true,
                                selectAllRowsItemText: 'Todos',
                            }}
                            pagination={true}
                            progressPending={isLoading}
                            progressComponent={<Container mt={5} minW={'100%'}><Progress size='xs' isIndeterminate /></Container>}       
                            selectableRows={selectable}
                            onSelectedRowsChange={(state) => handleRowSelected(state)}
                            clearSelectedRows={clearSelectedRows}             
                        />
                    </>
                }
            </TableContainer>
        )
    }
    else {
        delete customStyles.table.style.height;
        customStyles.headCells.style = {
            justifyContent: 'center',
            backgroundColor: '#4080bf',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600
        }
        customStyles.cells.style.fontWeight = 500;

        return (
            <TableContainerSimple containerWidth={containerWidth} >    
                {
                    !error && <>
                        {data && <TableFilter handleOnChange={(value) => handleFilter(value)} />}
                        <DataTable
                            columns={columns}
                            data={dataFiltered ? dataFiltered : data}
                            customStyles={customStyles}
                            fixedHeader={true}
                            noDataComponent={<Text color={'gray.400'}>No hay registros para mostrar</Text>}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Filas por página',
                                rangeSeparatorText: 'de',
                                selectAllRowsItem: true,
                                selectAllRowsItemText: 'Todos',
                            }}
                            pagination={true}
                            progressPending={isLoading}
                            progressComponent={<Container mt={5} minW={'100%'}><Progress size='xs' isIndeterminate /></Container>}       
                            selectableRows={selectable}
                            onSelectedRowsChange={(state) => handleRowSelected(state)}
                            clearSelectedRows={clearSelectedRows}  
                            paginationPerPage={15}           
                        />
                    </>
                }
            </TableContainerSimple>
        )
    }    
}

export default Table;